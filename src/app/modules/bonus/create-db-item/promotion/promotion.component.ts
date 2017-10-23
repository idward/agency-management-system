import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {UUID} from 'angular2-uuid';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import * as _ from 'lodash';

import {OptionItem} from "../../../../model/optionItem/optionItem.model";
import {BONUSTYPEDESC} from "../../../../data/optionItem/optionItem.data";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class DBPromotionComponent implements OnInit, OnDestroy {
  dbNumber:string;
  bonusType:string;
  createdDBType:string;
  combinationType:number;
  showLoading:boolean;
  isShowByAnnualPolicy:boolean;
  selectedNodIds:any;
  selectedType:string;
  selectedNodItems:any = [];
  isCalSavingAmount:number;
  protectedDatas:object[] = [];
  commonSetting:any;
  dynamicTypes:any;
  nodItemOptions:OptionItem[] = [];
  BonusTypeOptions:OptionItem[] = [];
  BonusDetailsOptions:OptionItem[] = [];
  nodOrDBNumbers:object[];
  nodItemOrDBItemNumbers:object[];
  datas:Observable<any>;
  selectedDBDatas:Observable<any>;
  createdDBDatas:Observable<any>;
  editedDBDatas:any;
  existedSelDBDatas:object[] = [];
  originalDatas:object[];
  orginalDataSubscription:Subscription;
  nodItemsSubscription:Subscription;
  selDBDataSubscription:Subscription;
  createdDBDataSubscription:Subscription;

  constructor(private _route:ActivatedRoute, private store$:Store<any>,
              @Inject('BonusService') private _bonusService) {

    const dbDatas$ = this.store$.select('dbDatas');
    const dbFilterDatas$ = this.store$.select('dbFilterDatas');

    const dbSelDatas$ = this.store$.select('dbSelDatas');
    const dbSelFilterDatas$ = this.store$.select('dbSelFilterDatas');

    const dbCreatedDatas$ = this.store$.select('dbCreatedDatas');
    const dbCreatedFilterDatas$ = this.store$.select('dbCreatedFilterDatas');

    this.datas = Observable.combineLatest(dbDatas$, dbFilterDatas$,
      (datas:any, filter:any) => datas.filter(filter));

    this.selectedDBDatas = Observable.combineLatest(dbSelDatas$, dbSelFilterDatas$,
      (datas:any, filter:any) => datas.filter(filter));

    this.createdDBDatas = Observable.combineLatest(dbCreatedDatas$, dbCreatedFilterDatas$,
      (datas:any, filter:any) => datas.filter(filter));

    this.dynamicTypes = [
      {cnName: '金融', enName: 'financial'},
      {cnName: '保险', enName: 'insurance'},
      {cnName: '置换', enName: 'replacement'},
      {cnName: '延保', enName: 'expandInsurance'},
      {cnName: '保养', enName: 'maintain'},
      {cnName: '附件', enName: 'attachment'},
      {cnName: 'onStar', enName: 'onStar'},
      {cnName: '融资租赁-签约', enName: 'assignment'},
      {cnName: '融资租赁-回购', enName: 'purchase'}
    ];
  }

  ngOnInit() {
    this.nodItemOptions = [new OptionItem('单车金额', 'PROMOTIONAL_RATIO'), new OptionItem('总金额', 'PROMOTIONAL_AMOUNT')];
    this.BonusTypeOptions = [new OptionItem('促销', 'PROMOTION'), new OptionItem('年度政策', 'ANNUAL_POLICY')];

    this.BonusDetailsOptions = BONUSTYPEDESC;

    this.commonSetting = {
      'desc': '',
      'fastProcess': false,
      'bonusType': '',
      'startTime': '',
      'endTime': ''
    }

    this.showLoading = true;

    this._bonusService.getData()
      .subscribe(data => {
        this.combinationType = data.combination_type;
        this.selectedNodIds = data.selectedNodIds;
        this.isCalSavingAmount = data.isCalSavingAmount === true ? 1 : 0;
      });

    this._route.params.subscribe((params:Params) => {
      this.dbNumber = params.dbId;
    });

    if (!this.nodItemsSubscription) {
      this.nodItemsSubscription = this._bonusService.getNodDetailByIds(this.combinationType, this.selectedNodIds, this.isCalSavingAmount)
        .subscribe(data => {
            let datas = {};
            if (data['singleInfo'] && data['singleInfo'].length > 0) {
              datas['singleInfo'] = data['singleInfo'].map(subdata => {
                let noCashDatas = subdata.nodItemNoncashTypeBO.map(ssubdata => {
                  let tempData = {};
                  let basicData = this.dynamicTypes[ssubdata.noncashType * 1 - 1];
                  tempData[basicData.enName + 'Percent'] = ssubdata.percent;
                  tempData[basicData.enName + 'Amount'] = ssubdata.amount;
                  tempData['is' + _.capitalize(basicData.enName) + 'PromotionAmount'] = ssubdata.isPromotionAmount === 'YES' ? 1 : 0;
                  tempData['headerName'] = basicData.cnName;
                  subdata[basicData.enName] = tempData;
                  return tempData;
                });

                delete subdata.nodItemNoncashTypeBO;
                return subdata;
              });
            }

            if (data['totalInfo'] && data['totalInfo'].length > 0) {
              datas['totalInfo'] = data['totalInfo'].map(subdata => {
                let noCashDatas = subdata.noncashTypeInfoes.map(ssubdata => {
                  let tempData = {};
                  let basicData = this.dynamicTypes[ssubdata.noncashType * 1 - 1];
                  tempData[basicData.enName + 'TotalAmount'] = ssubdata.totalAmount;
                  tempData['is' + _.capitalize(basicData.enName) + 'PromotionTotalAmount'] =
                    ssubdata.isPromotionTotalAmount === 'YES' ? 1 : 0;
                  tempData['headerName'] = basicData.cnName;
                  subdata[basicData.enName + 'TotalAmount'] = tempData;
                  return tempData;
                });

                delete  subdata.noncashTypeInfoes;
                return subdata;
              });
            }

            if (data['annualPolicies'] && data['annualPolicies'].length > 0) {
              datas['annualPolicies'] = data['annualPolicies'].map(subdata => {
                return subdata;
              });
            }

            this.showLoading = false;

            this.store$.dispatch({type: 'ADD_DB_DATAS', payload: datas});
          }
        );
    }

    if (!this.orginalDataSubscription) {
      this.orginalDataSubscription = this.datas.subscribe(datas => {
        this.nodOrDBNumbers = [];
        this.nodItemOrDBItemNumbers = [];
        this.nodOrDBNumbers.push({label: '所有数据', value: null});
        this.nodItemOrDBItemNumbers.push({label: '所有数据', value: null});
        for (let i = 0; i < datas.length; i++) {
          this.nodOrDBNumbers.push({label: datas[i]['nodNumber'], value: datas[i]['nodNumber']});
          this.nodItemOrDBItemNumbers.push({label: datas[i]['nodItemNumber'], value: datas[i]['nodItemNumber']});
        }
        this.nodOrDBNumbers = _.uniqBy(this.nodOrDBNumbers, 'label');
        this.nodItemOrDBItemNumbers = _.uniqBy(this.nodItemOrDBItemNumbers, 'label');

        this.originalDatas = datas;
        console.log('finalDatas:', datas);
      });
    }

    if (this.nodItemsSubscription) {
      this.selDBDataSubscription = this.selectedDBDatas.subscribe(datas => {
        console.log('selectedDBDatas:', datas);
        this.existedSelDBDatas = datas;
        this.editedDBDatas = datas.map(data => {
          let temp = {};
          for (var p in data) {
            if (data[p] && typeof data[p] === 'object') {
              temp[p] = _.assign({}, data[p]);
            }
          }
          return _.assign({}, data, temp);
        });
      });
    }

    if (!this.createdDBDataSubscription) {
      this.createdDBDataSubscription = this.createdDBDatas.subscribe(datas => {
        console.log('createdDBDatas:', datas);
      });
    }
  }

  ngOnDestroy() {
    if (this.nodItemsSubscription) {
      this.store$.dispatch({type: 'EMPTY_ALL_NODITEMDATAS'});
      this.nodItemsSubscription.unsubscribe();
    }

    if (this.selDBDataSubscription) {
      this.store$.dispatch({type: 'EMPTY_ALL_SELDBDATAS'});
      this.selDBDataSubscription.unsubscribe();
    }

    if (this.createdDBDataSubscription) {
      this.store$.dispatch({type: 'EMPTY_ALL_CREATED_DBDATAS'});
      this.createdDBDataSubscription.unsubscribe();
    }

    if (this.orginalDataSubscription) {
      this.orginalDataSubscription.unsubscribe();
    }
  }

  createNewItem(datas:any) {
    let finalDatas:object[];
    this.createdDBType = datas.selectedType;
    let selectedItems = datas.selectedItems;

    if (this.existedSelDBDatas.length > 0) {
      window.alert('无法创建，请先保存数据！');
      return;
    }

    if (this.protectedDatas.length > 0) {
      for (let i = 0; i < selectedItems.length; i++) {
        let result = _.findIndex(this.protectedDatas, function (o) {
          return o['nodNumber'] === selectedItems[i].nodNumber &&
            o['nodItemNumber'] === selectedItems[i].nodItemNumber;
        });
        if (result !== -1) {
          window.alert('选择数据错误，创建失败!');
          return;
        }
      }
    }

    let itemBusinessTypes = selectedItems.map(item => {
      return item.itemBusinessType;
    });

    itemBusinessTypes = _.uniq(itemBusinessTypes);

    let baseTypes = selectedItems.map(item => item['baseType']);
    baseTypes = _.uniq(baseTypes);

    if (this.createdDBType === 'PROMOTIONAL_RATIO') {
      if (itemBusinessTypes.length === 2) {
        window.alert('类型创建错误');
        return;
      } else if (itemBusinessTypes.length === 1 && itemBusinessTypes[0] === '2') {
        window.alert('类型创建错误');
        return;
      } else if (itemBusinessTypes.length === 1 && baseTypes.length === 2) {
        window.alert('类型创建错误');
        return;
      } else if (itemBusinessTypes.length === 1 && baseTypes.length === 1) {
        if (baseTypes[0] === '2') {
          let annualPolicyDatas = selectedItems.filter(item => {
            return item['baseType'] === '2';
          });

          if (annualPolicyDatas.length > 1) {
            let filterAnnualPolicyDatas = annualPolicyDatas.map(data => {
              return {rewardTypeDescription: data['rewardTypeDescription'], grantBasis: data['grantBasis']};
            })

            filterAnnualPolicyDatas = _.uniqWith(filterAnnualPolicyDatas, _.isEqual);

            if (filterAnnualPolicyDatas.length > 1) {
              window.alert('年度政策数据类型不一致');
              return;
            }
          }
        }
      }

      finalDatas = [...selectedItems];
    } else if (this.createdDBType === 'PROMOTIONAL_AMOUNT') {
      if (itemBusinessTypes.length === 1 && itemBusinessTypes[0] === '1') {
        let baseTypes = selectedItems.map(item => item['baseType']);
        baseTypes = _.uniq(baseTypes);

        if (baseTypes[0] === '2') {
          window.alert('类型创建错误');
          return;
        }

        let newDatas = [];
        let nodNumbers = selectedItems.map(item => item['nodNumber']);
        nodNumbers = _.uniq(nodNumbers);
        for (let i = 0; i < nodNumbers.length; i++) {
          let tempData = [];
          for (let j = 0; j < selectedItems.length; j++) {
            if (selectedItems[j]['nodNumber'] === nodNumbers[i]) {
              tempData.push(selectedItems[j]);
            }
          }
          let nodItemNumbers = tempData.map(item => item['nodItemNumber']);
          nodItemNumbers = _.uniq(nodItemNumbers);
          for (let k = 0; k < nodItemNumbers.length; k++) {
            let subTempData = [];
            for (let h = 0; h < tempData.length; h++) {
              if (tempData[h]['nodItemNumber'] === nodItemNumbers[k]) {
                subTempData.push(tempData[h]);
              }
            }
            let totalSavingAmount = this.calTotalSavingAmount(subTempData);
            let combinationData = this.convertToNewData(subTempData, totalSavingAmount);
            newDatas.push(combinationData);
          }
        }
        finalDatas = [...newDatas];
      } else {
        if (itemBusinessTypes.length === 2) {

          let newDatas = [];
          for (let i = 0; i < itemBusinessTypes.length; i++) {
            let tempData = [];
            for (let j = 0; j < selectedItems.length; j++) {
              if (selectedItems[j]['itemBusinessType'] === itemBusinessTypes[i]) {
                tempData.push(selectedItems[j]);
              }
            }
            let nodItemIds = tempData.map(item => item['nodItemId']);
            nodItemIds = _.uniq(nodItemIds);
            for (let k = 0; k < nodItemIds.length; k++) {
              let subTempData = [];
              for (let h = 0; h < tempData.length; h++) {
                if (tempData[h]['nodItemId'] === nodItemIds[k]) {
                  subTempData.push(tempData[h]);
                }
              }
              if (itemBusinessTypes[i] === '1') {
                let totalSavingAmount = this.calTotalSavingAmount(subTempData);
                let combinationData = this.convertToNewData(subTempData, totalSavingAmount);
                newDatas.push(combinationData);
              } else {
                newDatas = [...newDatas, ...subTempData];
              }
            }
          }
          finalDatas = [...newDatas];
        } else {
          finalDatas = [...selectedItems];
        }
      }
    }

    if (itemBusinessTypes.length === 2 || (itemBusinessTypes.length === 1
      && itemBusinessTypes[0] === '1' && this.createdDBType === 'PROMOTIONAL_AMOUNT')) {
      for (let i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].itemBusinessType === '1') {
          this.protectedDatas.push(selectedItems[i]);
        }
      }
    }

    let isIncludingAnnualPolicy = _.findIndex(selectedItems, function (o) {
      return o['baseType'] === '2';
    });

    if (isIncludingAnnualPolicy !== -1) {
      this.isShowByAnnualPolicy = true;
    }

    this.store$.dispatch({type: 'ADD_SELECTED_DATAS', payload: finalDatas});
  }

  calTotalSavingAmount(selectedItems:object[]):number {
    let allItems = this.originalDatas.filter(data => {
      return data['nodItemId'] === selectedItems[0]['nodItemId'];
    });
    let savingAmt = allItems.map(item => item['savingAmount']);
    let totalSavingAmt = savingAmt.reduce((a, b) => {
      return a + b;
    }, 0);
    return totalSavingAmt;
  }

  convertToNewData(datas:object[], savingAmount:number):object {
    let obj = Object.assign({}, datas[0]);
    for (let p in obj) {
      if (p !== 'nodNumber' && p !== 'nodItemNumber' && p !== 'savingAmount' && p !== 'baseType') {
        obj[p] = null;
      } else {
        if (p === 'savingAmount') {
          obj[p] = savingAmount;
        }
      }
    }
    return obj;
  }

  createNewDB() {
    let finalCreatedDBDatas = [];
    let rowCount = 0;
    let dbItemNumber = UUID.UUID();
    for (let i = 0; i < this.editedDBDatas.length; i++) {
      let newDB = {};
      rowCount ++;
      newDB['dbItemNumber'] = dbItemNumber;
      newDB['rowNumber'] = rowCount;
      newDB['setting_condition'] = Object.assign({},this.commonSetting);
      newDB['data'] = this.editedDBDatas[i];
      finalCreatedDBDatas.push(newDB);
    }

    this.store$.dispatch({type: 'ADD_CREATED_DB_DATAS', payload: finalCreatedDBDatas});

    this.store$.dispatch({type: 'EMPTY_ALL_SELDBDATAS'});
    this.commonSetting = {};
    this.selectedNodItems = [];
  }

  changeValueByPercent(percent:number) {
    this.store$.dispatch({type: 'GET_SELECTED_DATAS'});
    this.editedDBDatas = this.editedDBDatas.map(data => {
      _.forIn(data, (value, key) => {
        if (key.indexOf('Percent') !== -1) {
          data[key] = percent / 100 * value;
        } else if (key.indexOf('Amount') !== -1 && key.indexOf('is') === -1) {
          data[key] = percent / 100 * value;
        } else if (typeof data[key] === 'object') {
          let subdata = data[key];
          _.forIn(subdata, (value, key) => {
            if (key.indexOf('Percent') !== -1) {
              subdata[key] = percent / 100 * value;
            } else if (key.indexOf('Amount') !== -1 && key.indexOf('is') === -1) {
              subdata[key] = percent / 100 * value;
            }
          })
        }
      });

      return data;
    });
  }

  changeValueByMSRP(data:any) {
    if (typeof data.rowData[data.fieldName] === 'object') {
      data.rowData[data.fieldName][data.fieldName + 'Amount'] =
        data.rowData[data.fieldName][data.fieldName + 'Percent'] / 100 * data.rowData['msrp'];
    } else {
      let amountField = data.fieldName.slice(0, data.fieldName.length - 7);
      data.rowData[amountField + 'Amount'] = data.rowData[data.fieldName] / 100 * data.rowData['msrp'];
    }
  }
}
