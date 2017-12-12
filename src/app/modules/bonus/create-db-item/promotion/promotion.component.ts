import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Params, ActivatedRoute, Router} from '@angular/router';
import {UUID} from 'angular2-uuid';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

import {OptionItem} from "../../../../model/optionItem/optionItem.model";
import {BONUSTYPEDESC} from "../../../../data/optionItem/optionItem.data";
import {Message} from "primeng/primeng";
import {debug} from "util";

type AOA = Array<Array<any>>;

function s2ab(s: string): ArrayBuffer {
  const buf: ArrayBuffer = new ArrayBuffer(s.length);
  const view: Uint8Array = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class DBPromotionComponent implements OnInit, OnDestroy {
  data: AOA;
  isShowButton:boolean;
  dbNumber: string;
  dbDesc: string;
  selectedDep: string;
  bonusType: string;
  createdDBType: string;
  combinationType: number;
  showLoading: boolean;
  isShowByAnnualPolicy: boolean;
  selectedNodIds: any;
  selectedType: string;
  selectedNodItems: any = [];
  isCalSavingAmount: number;
  protectedDatas: object[] = [];
  initialCommonSetting: any;
  commonSetting: any;
  dynamicTypes: any;
  nodItemOptions: OptionItem[] = [];
  BonusTypeOptions: OptionItem[] = [];
  BonusDetailsOptions: OptionItem[] = [];
  nodOrDBNumbers: object[];
  nodItemOrDBItemNumbers: object[];
  datas: Observable<any>;
  selectedDBDatas: Observable<any>;
  createdDBDatas: Observable<any>;
  editedDBDatas: any;
  savedDBDatas: any;
  bonusTypeDescription: object;
  existedSelDBDatas: object[] = [];
  originalSELDatas: object[] = [];
  originalDatas: object[];
  saveResultInfo: Message[];
  orginalDataSubscription: Subscription;
  nodItemsSubscription: Subscription;
  selDBDataSubscription: Subscription;
  createdDBDataSubscription: Subscription;

  constructor(private _route: ActivatedRoute, private _router: Router,
              private store$: Store<any>, @Inject('BonusService') private _bonusService) {

    const dbDatas$ = this.store$.select('dbDatas');
    const dbFilterDatas$ = this.store$.select('dbFilterDatas');

    const dbSelDatas$ = this.store$.select('dbSelDatas');
    const dbSelFilterDatas$ = this.store$.select('dbSelFilterDatas');

    const dbCreatedDatas$ = this.store$.select('dbCreatedDatas');
    const dbCreatedFilterDatas$ = this.store$.select('dbCreatedFilterDatas');

    this.datas = Observable.combineLatest(dbDatas$, dbFilterDatas$,
      (datas: any, filter: any) => datas.filter(filter));

    this.selectedDBDatas = Observable.combineLatest(dbSelDatas$, dbSelFilterDatas$,
      (datas: any, filter: any) => datas.filter(filter));

    this.createdDBDatas = Observable.combineLatest(dbCreatedDatas$, dbCreatedFilterDatas$,
      (datas: any, filter: any) => datas.filter(filter));

    this.dynamicTypes = {
      'Z301': {cnName: '金融', enName: 'financial'},
      'Z302': {cnName: '保险', enName: 'insurance'},
      'Z303': {cnName: '置换', enName: 'replacement'},
      'Z304': {cnName: '延保', enName: 'expandInsurance'},
      'Z305': {cnName: '保养', enName: 'maintain'},
      'Z306': {cnName: '附件', enName: 'attachment'},
      'Z307': {cnName: 'onStar', enName: 'onStar'},
      'Z504': {cnName: '融资租赁-签约', enName: 'assignment'},
      'Z505': {cnName: '融资租赁-回购', enName: 'purchase'}
    };
  }

  ngOnInit() {
    this.nodItemOptions = [new OptionItem('单车金额', 'PROMOTIONAL_RATIO'), new OptionItem('总金额', 'PROMOTIONAL_AMOUNT')];
    this.BonusTypeOptions = [new OptionItem('促销', 'PROMOTION'), new OptionItem('年度政策', 'ANNUAL_POLICY')];

    this.BonusDetailsOptions = BONUSTYPEDESC;

    this._bonusService.getBonusTypesOfAnnualPolicy()
      .subscribe(datas => {
        this.bonusTypeDescription = {};
        // this.bonusTypeDescription.push(new OptionItem('请选择...', ''));
        for (let i = 0; i < datas.length; i++) {
          if (!this.bonusTypeDescription[datas[i].dataName]) {
            this.bonusTypeDescription[datas[i].dataName] = datas[i].dataValue;
          }
        }
      });

    this.initialCommonSetting = {
      'desc': '',
      'fastProcess': {
        'rapidProcessType': '',
        'period': '',
        'releaseSystem': '',
        'isNeedHold': false
      },
      'isFastProcess': false,
      'bonusType': '',
      'startTime': null,
      'endTime': null
    };

    this.commonSetting = this.initialCommonSetting;

    this.showLoading = true;

    this._bonusService.getData()
      .subscribe(data => {
        this.combinationType = data.combination_type;
        this.selectedNodIds = data.selectedNodIds;
        this.isCalSavingAmount = data.isCalSavingAmount === true ? 1 : 0;
        this.selectedDep = data.department;
        this.dbDesc = data.description;
      });

    this._route.params.subscribe((params: Params) => {
      this.dbNumber = params.dbId;
    });

    if (!this.nodItemsSubscription) {
      this.nodItemsSubscription = this._bonusService.getNodDetailByIds(this.combinationType, this.selectedNodIds, this.isCalSavingAmount)
        .subscribe(data => {
            let datas = {};
            datas['singleInfo'] = [];
            datas['totalInfo'] = [];
            datas['annualPolicies'] = [];
            if (data['singleInfo'] && data['singleInfo'].length > 0) {
              datas['singleInfo'] = data['singleInfo'].map(subdata => {
                let noCashDatas = subdata.nodItemNoncashTypeBO.map(ssubdata => {
                  let tempData = {};
                  let basicData = this.dynamicTypes[ssubdata.noncashType];
                  tempData['noncashType'] = ssubdata.noncashType;
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
                  let basicData = this.dynamicTypes[ssubdata.noncashType];
                  tempData['noncashType'] = ssubdata.noncashType;
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
      });
    }

    if (this.nodItemsSubscription) {
      this.selDBDataSubscription = this.selectedDBDatas.subscribe(datas => {
        this.existedSelDBDatas = datas;
        this.editedDBDatas = datas.map(data => {
          let temp = {};
          for (var p in data) {
            if (data[p] && typeof data[p] === 'object') {
              if (!(data[p] instanceof Array)) {
                temp[p] = _.assign({}, data[p]);
              }
            }
          }
          return _.assign({}, data, temp);
        });
      });
    }

    if (!this.createdDBDataSubscription) {
      this.createdDBDataSubscription = this.createdDBDatas.subscribe(datas => {
        this.savedDBDatas = datas;
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

  createNewItem(datas: any) {
    let finalDatas: object[];
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
    } else {
      this.isShowByAnnualPolicy = false;
    }

    if(this.createdDBType === 'PROMOTIONAL_RATIO'){
      this.isShowButton = true;
    }

    this.store$.dispatch({type: 'ADD_SELECTED_DATAS', payload: finalDatas});
  }

  calTotalSavingAmount(selectedItems: object[]): number {
    let allItems = this.originalDatas.filter(data => {
      return data['nodItemId'] === selectedItems[0]['nodItemId'];
    });
    let savingAmt = allItems.map(item => item['savingAmount']);
    let totalSavingAmt = savingAmt.reduce((a, b) => {
      return a + b;
    }, 0);
    return totalSavingAmt;
  }

  convertToNewData(datas: object[], savingAmount: number): object {
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
    let checkResult = this.checkIsFinishedCommonSetting();
    if (!checkResult['status']) {
      window.alert(checkResult['message']);
      return;
    }

    if (this.commonSetting['endTime'].getTime() < this.commonSetting['startTime'].getTime()) {
      window.alert('结束时间必须大于开始时间');
      return;
    }

    let finalCreatedDBDatas = [];
    let rowCount = 0;
    let dbItemNumber = UUID.UUID();
    this.commonSetting['bonusType'] = this.createdDBType;

    let baseTypes = this.editedDBDatas.map(data => {
      return data['baseType'];
    });

    baseTypes = _.uniq(baseTypes);

    if (this.createdDBType === 'PROMOTIONAL_RATIO' && baseTypes.length === 1 && baseTypes[0] === '2') {
      let tempData = {};
      let percents = this.editedDBDatas.map(data => {
        return data['singleCarPercent'] * 1;
      });
      let totalPercents = percents.reduce(function (a, b) {
        return a + b;
      }, 0);

      for (let p in this.editedDBDatas[0]) {
        if (p !== 'singleCarPercent') {
          tempData[p] = this.editedDBDatas[0][p];
        } else {
          tempData[p] = totalPercents;
        }
      }

      this.editedDBDatas = [Object.assign({}, tempData)];
    }

    if (this.createdDBType === 'PROMOTIONAL_AMOUNT' && baseTypes.length === 1 && baseTypes[0] === '1') {
      let tempData = {};

      let cashTotalAmount = this.editedDBDatas.map(data => {
        return data['cashTotalAmount'] * 1;
      });
      let noncashTotalAmount = this.editedDBDatas.map(data => {
        return data['noncashTotalAmount'] * 1;
      });
      let financialTotalAmount = this.editedDBDatas.map(data => {
        if (data['financialTotalAmount']) {
          return data['financialTotalAmount']['financialTotalAmount'] * 1
        }
        // return [];
      });
      let insuranceTotalAmount = this.editedDBDatas.map(data => {
        if (data['insuranceTotalAmount']) {
          return data['insuranceTotalAmount']['insuranceTotalAmount'] * 1;
        }
        // return [];
      });
      let replacementTotalAmount = this.editedDBDatas.map(data => {
        if (data['replacementTotalAmount']) {
          return data['replacementTotalAmount']['replacementTotalAmount'] * 1;
        }
        // return [];
      });

      cashTotalAmount = cashTotalAmount.reduce(function (a, b) {
        return a + b;
      }, 0);
      noncashTotalAmount = noncashTotalAmount.reduce(function (a, b) {
        return a + b;
      }, 0);
      financialTotalAmount = financialTotalAmount.reduce(function (a, b) {
        return a + b;
      }, 0);
      insuranceTotalAmount = insuranceTotalAmount.reduce(function (a, b) {
        return a + b;
      }, 0);
      replacementTotalAmount = replacementTotalAmount.reduce(function (a, b) {
        return a + b;
      }, 0);

      let combinedFieldList = ['cashTotalAmount', 'savingAmount', 'noncashTotalAmount',
        'financialTotalAmount', 'insuranceTotalAmount', 'replacementTotalAmount'];

      for (let p in this.editedDBDatas[0]) {
        if (combinedFieldList.indexOf(p) !== -1) {
          if (p === 'financialTotalAmount') {
            tempData[p] = this.editedDBDatas[0][p];
            tempData[p][p] = financialTotalAmount;
          } else if (p === 'insuranceTotalAmount') {
            tempData[p] = this.editedDBDatas[0][p];
            tempData[p][p] = insuranceTotalAmount;
          } else if (p === 'replacementTotalAmount') {
            tempData[p] = this.editedDBDatas[0][p];
            tempData[p][p] = replacementTotalAmount;
          } else if (p === 'cashTotalAmount') {
            tempData[p] = cashTotalAmount;
          } else if (p === 'noncashTotalAmount') {
            tempData[p] = noncashTotalAmount;
          }
        } else {
          tempData[p] = this.editedDBDatas[0][p];
        }
      }

      this.editedDBDatas = [Object.assign({}, tempData)];
    }

    for (let i = 0; i < this.editedDBDatas.length; i++) {
      let newDB = {};
      rowCount++;
      newDB['dbItemNumber'] = dbItemNumber;
      newDB['rowNumber'] = rowCount;
      newDB['setting_condition'] = Object.assign({}, this.commonSetting);
      newDB['data'] = this.editedDBDatas[i];
      finalCreatedDBDatas.push(newDB);
    }

    let orginalDatas = {};
    orginalDatas['dbItemNumber'] = dbItemNumber;
    orginalDatas['data'] = this.existedSelDBDatas;
    this.originalSELDatas.push(orginalDatas);

    this.store$.dispatch({type: 'ADD_CREATED_DB_DATAS', payload: finalCreatedDBDatas});

    this.store$.dispatch({type: 'EMPTY_ALL_SELDBDATAS'});
    this.commonSetting = this.initialCommonSetting;
    this.selectedNodItems = [];
    if(this.createdDBType === 'PROMOTIONAL_RATIO'){
      this.isShowButton = false;
    }
    // this.isShowByAnnualPolicy = false;
  }

  checkIsFinishedCommonSetting() {
    let errorMessages = {
      desc: '请填写ITEM描述',
      startTime: '请选择开始时间',
      endTime: '请选择结束时间',
    };

    let checkResult = {};
    checkResult['status'] = true;
    checkResult['message'] = [];
    for (let p in this.commonSetting) {
      if (p !== 'bonusType' && p !== 'fastProcess') {
        if (this.commonSetting[p] === '' || this.commonSetting[p] === null) {
          checkResult['status'] = false;
          checkResult['message'].push(errorMessages[p]);
          break;
        }
      }
    }
    return checkResult;
  }

  getCommonData(data: any) {
    if (data['fastProcess']['rapidProcessType'] !== '') {
      data['isFastProcess'] = true;
    }

    this.commonSetting = data;
  }

  approvalProcess() {
    let datas = this.buildDBDatas();
    this._bonusService.saveDBInfo(datas)
      .subscribe(data => {
          if (data.success) {
            this.saveResultInfo = [];
            this.saveResultInfo.push({severity: 'success', summary: '', detail: data.code + data.message});
            setTimeout(() => {
              this._router.navigate(['bonus/db']);
            }, 3000);
          } else {
            this.saveResultInfo = [];
            this.saveResultInfo.push({severity: 'error', summary: '', detail: data.message});
          }
        },
        err => {
          this.saveResultInfo = [];
          let errorStatus = err.message;
          this.saveResultInfo.push({severity: 'error', summary: '', detail: '保存失败！'});
          setTimeout(function () {
            this._router.navigate(['error', errorStatus]);
          }.bind(this, errorStatus), 3000);
        }
      );
  }

  buildDBDatas(): any {
    //重新组合savedDBDatas
    this.savedDBDatas = this.rebuildSavedDBDatas(this.savedDBDatas);

    let dbData = {};
    dbData['dbNumber'] = this.dbNumber;
    dbData['description'] = this.dbDesc;
    dbData['useDepartment'] = this.selectedDep;
    dbData['state'] = '3';
    dbData['dbItemBaseBO'] = [];

    for (let i = 0; i < this.savedDBDatas.length; i++) {
      let dbItem = {};
      let isFastProcess = this.savedDBDatas[i]['setting_condition']['fastProcess']['rapidProcessType'] !== '' ? 1 : 0;

      dbItem['businessType'] = this.isShowByAnnualPolicy === false ? '1' : '2';
      dbItem['dbBaseItemNumber'] = this.savedDBDatas[i]['dbItemNumber'];
      dbItem['itemDescription'] = this.savedDBDatas[i]['setting_condition']['desc'];
      dbItem['itemBusinessType'] = this.createdDBType === 'PROMOTIONAL_RATIO' ? '1' : '2';
      dbItem['startDate'] = this.savedDBDatas[i]['setting_condition']['startTime'].getTime();
      dbItem['endDate'] = this.savedDBDatas[i]['setting_condition']['endTime'].getTime();
      dbItem['isRapidProcess'] = isFastProcess ? 'YES' : 'NO';
      dbItem['state'] = '3';

      dbItem['dbItemCashBO'] = [];
      dbItem['dbItemNoncashBO'] = [];
      dbItem['dbCashTotalAmountBO'] = [];
      dbItem['dbNonCashTotalAmountBO'] = [];
      dbItem['dbAnnualPolicyBO'] = [];
      if (isFastProcess) {
        dbItem['dbRapidProcessBO'] = this.savedDBDatas[i]['setting_condition']['fastProcess'];
        dbItem['dbRapidProcessBO']['isNeedHold'] = dbItem['dbRapidProcessBO']['isNeedHold'] === true ? 'YES' : 'NO';
      } else {
        dbItem['dbRapidProcessBO'] = null;
      }

      let datas = this.savedDBDatas[i]['data'];

      for (let j = 0; j < datas.length; j++) {
        if (datas[j]['baseType'] === '1' && datas[j]['itemBusinessType'] === '1') {
          let cashData = {}, nocashData = {};
          //现金部分
          cashData['dbItemNumber'] = this.savedDBDatas[i]['dbItemNumber'];
          cashData['carSeries'] = datas[j]['carSeries'];
          cashData['financialDescription'] = datas[j]['financialDescription'];
          cashData['msrp'] = datas[j]['msrp'];
          cashData['callOffPromotionAmount'] = datas[j]['callOffPromotionAmount'];
          cashData['isCallOffPromotionAmount'] = datas[j]['isCallOffPromotionAmount'];
          cashData['deliveryPromotionAmount'] = datas[j]['deliveryPromotionAmount'];
          cashData['isDeliveryPromotionAmount'] = datas[j]['isDeliveryPromotionAmount'];
          cashData['dealerInventoryAmount'] = datas[j]['dealerInventoryAmount'];
          cashData['isDealerInventoryAmount'] = datas[j]['isDealerInventoryAmount'];

          //非现金部分
          nocashData['dbItemNumber'] = this.savedDBDatas[i]['dbItemNumber'];
          nocashData['carSeries'] = datas[j]['carSeries'];
          nocashData['financialDescription'] = datas[j]['financialDescription'];
          nocashData['msrp'] = datas[j]['msrp'];
          nocashData['singlecarTotalBudgetAmount'] = datas[j]['singlecarTotalBudgetAmount'];
          nocashData['msrp'] = datas[j]['msrp'];
          nocashData['dbItemNoncashTypeBO'] = [];

          for (let p in datas[j]) {
            if (datas[j][p] && typeof datas[j][p] === 'object') {
              let tempData = {};
              tempData['noncashType'] = datas[j][p]['noncashType'];
              tempData['amount'] = datas[j][p][p + 'Amount'];
              tempData['isPromotionAmount'] = datas[j][p]['is' + _.capitalize(p) + 'PromotionAmount'] === 1 ? 'YES' : 'NO';
              nocashData['dbItemNoncashTypeBO'].push(tempData);
            }
          }

          dbItem['dbItemCashBO'].push(cashData);
          dbItem['dbItemNoncashBO'].push(nocashData);
        } else if (datas[j]['baseType'] === '1' && datas[j]['itemBusinessType'] === '2') {
          if (datas[j]['cashTotalAmount']) {
            let tempData = {};
            tempData['cashTotalAmount'] = datas[j]['cashTotalAmount'];
            tempData['controlType'] = datas[j]['controlType'];
            tempData['dbItemCashBO'] = [];
            for (let m = 0; m < datas[j]['carDescr'].length; m++) {
              let financialData = {};
              financialData['dbItemNumber'] = this.savedDBDatas[i]['dbItemNumber'];
              financialData['carSeries'] = datas[j]['carDescr'][m]['carSeries'];
              financialData['financialDescription'] = datas[j]['carDescr'][m]['financialDescription'];
              tempData['dbItemCashBO'].push(financialData);
            }
            dbItem['dbCashTotalAmountBO'].push(tempData);
          }

          if (datas[j]['noncashTotalAmount']) {
            let tempData = {};
            tempData['noncashTotalAmount'] = datas[j]['noncashTotalAmount'];
            tempData['controlType'] = datas[j]['controlType'];
            tempData['dbItemNoncashBO'] = [];
            tempData['dbTotalNoncashTypeBO'] = [];
            for (let n = 0; n < datas[j]['carDescr'].length; n++) {
              let financialData = {};
              financialData['dbItemNumber'] = this.savedDBDatas[i]['dbItemNumber'];
              financialData['carSeries'] = datas[j]['carDescr'][n]['carSeries'];
              financialData['financialDescription'] = datas[j]['carDescr'][n]['financialDescription'];
              tempData['dbItemNoncashBO'].push(financialData);
            }

            for (let p in datas[j]) {
              if (datas[j][p] && typeof datas[j][p] === 'object') {
                if (!(datas[j][p] instanceof Array)) {
                  let field = p.slice(0, p.length - 11);
                  let nonCashData = {};
                  nonCashData['noncashType'] = datas[j][p]['noncashType'];
                  nonCashData['totalAmount'] = datas[j][p][p];
                  nonCashData['isPromotionTotalAmount'] = datas[j][p]['is' + _.capitalize(field) + 'PromotionTotalAmount'];
                  tempData['dbTotalNoncashTypeBO'].push(nonCashData);
                }
              }
            }

            dbItem['dbNonCashTotalAmountBO'].push(tempData);
          }
        } else {
          let annualPolicyData = {};
          annualPolicyData['dbItemNumber'] = this.savedDBDatas[i]['dbItemNumber'];
          annualPolicyData['rewardTypeDescription'] = datas[j]['rewardTypeDescription'];
          annualPolicyData['grantBasis'] = datas[j]['grantBasis'];
          annualPolicyData['singleCarPersent'] = datas[j]['singleCarPercent'];
          annualPolicyData['totalAmount'] = datas[j]['totalAmount'];
          annualPolicyData['startDate'] = datas[j]['createDate'];
          annualPolicyData['endDate'] = datas[j]['endDate'];
          annualPolicyData['remark'] = datas[j]['remark'];
          dbItem['dbAnnualPolicyBO'].push(annualPolicyData);
        }
      }
      //原始数据
      dbItem['nodMergeInfoBO'] = {};
      dbItem['nodMergeInfoBO']['singleInfo'] = [];
      dbItem['nodMergeInfoBO']['totalInfo'] = [];
      dbItem['nodMergeInfoBO']['annualPolicy'] = [];

      for (let h = 0; h < this.originalSELDatas.length; h++) {
        if (this.originalSELDatas[h]['dbItemNumber'] === dbItem['dbBaseItemNumber']) {
          let originalDatas = this.originalSELDatas[h]['data'];
          for (let k = 0; k < originalDatas.length; k++) {
            if (originalDatas[k]['baseType'] === '1' && originalDatas[k]['itemBusinessType'] === '1') {
              let tempData = {};
              tempData['nodNumber'] = originalDatas[k]['nodNumber'];
              tempData['nodItemId'] = originalDatas[k]['nodItemId'];
              tempData['nodItemNumber'] = originalDatas[k]['nodItemNumber'];
              tempData['financialDescription'] = originalDatas[k]['financialDescription'];
              dbItem['nodMergeInfoBO']['singleInfo'].push(tempData);
            } else if (originalDatas[k]['baseType'] === '1' && originalDatas[k]['itemBusinessType'] === '2') {
              let tempData = {};
              tempData['nodNumber'] = originalDatas[k]['nodNumber'];
              tempData['nodItemNumber'] = originalDatas[k]['nodItemNumber'];
              tempData['nodItemId'] = originalDatas[k]['nodItemId'];
              tempData['cashTotalAmount'] = originalDatas[k]['cashTotalAmount'];
              tempData['noncashTotalAmount'] = originalDatas[k]['noncashTotalAmount'];
              dbItem['nodMergeInfoBO']['totalInfo'].push(tempData);
            } else if (originalDatas[k]['baseType'] === '2') {
              let tempData = {};
              tempData['nodAnnualPolicyInfoId'] = originalDatas[k]['nodAnnualPolicyInfoId'];
              tempData['nodBaseInfoId'] = originalDatas[k]['nodBaseInfoId'];
              tempData['nodNumber'] = originalDatas[k]['nodNumber'];
              tempData['nodItemNumber'] = originalDatas[k]['nodItemNumber'];
              tempData['rewardTypeDescription'] = originalDatas[k]['rewardTypeDescription'];
              tempData['grantBasis'] = originalDatas[k]['grantBasis'];
              tempData['singleCarPercent'] = originalDatas[k]['singleCarPercent'];
              tempData['totalAmount'] = originalDatas[k]['totalAmount'];
              dbItem['nodMergeInfoBO']['annualPolicy'].push(tempData);
            }
          }
        }
      }

      dbData['dbItemBaseBO'].push(dbItem);
    }

    return dbData;
  }

  rebuildSavedDBDatas(savedDBDatas: any): any {
    let newDatas = [];
    let dbItemNumbers = savedDBDatas.map(data => {
      return data['dbItemNumber'];
    });

    dbItemNumbers = _.uniq(dbItemNumbers);

    for (let i = 0; i < dbItemNumbers.length; i++) {
      let tempData = {};
      tempData['data'] = [];
      for (let j = 0; j < savedDBDatas.length; j++) {
        if (savedDBDatas[j]['dbItemNumber'] === dbItemNumbers[i]) {
          tempData['data'].push(savedDBDatas[j]['data']);
          tempData['setting_condition'] = savedDBDatas[j]['setting_condition'];
          tempData['dbItemNumber'] = savedDBDatas[j]['dbItemNumber'];
        }
      }
      newDatas.push(tempData);
    }

    return newDatas;
  }

  uploadSelectedList(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));

      let newDatas = this.data.slice(1);
      if(newDatas.length !== this.editedDBDatas.length){
        window.alert('导入数据错误');
        return;
      }
      let finalDatas = this.rebuildEditedDatas(newDatas, this.editedDBDatas);
      this.store$.dispatch({type: 'EMPTY_ALL_SELDBDATAS'});
      this.store$.dispatch({type: 'ADD_SELECTED_DATAS', payload: finalDatas});
    };

    reader.readAsBinaryString(target.files[0]);
  }

  rebuildEditedDatas(uploadDatas: any, originDatas: any) {
    for (let i = 0; i < originDatas.length; i++) {
      originDatas[i]['nodNumber'] = uploadDatas[i][0];
      originDatas[i]['nodItemNumber'] = uploadDatas[i][1];
      originDatas[i]['carSeries'] = uploadDatas[i][2];
      originDatas[i]['financialDescription'] = uploadDatas[i][3];
      originDatas[i]['msrp'] = uploadDatas[i][4];
      originDatas[i]['baseType'] = uploadDatas[i][5];
      originDatas[i]['rewardTypeDescription'] = uploadDatas[i][6];
      originDatas[i]['grantBasis'] = uploadDatas[i][7];
      originDatas[i]['singleCarPercent'] = uploadDatas[i][8];
      originDatas[i]['totalAmount'] = uploadDatas[i][9];
      originDatas[i]['settingCondition'] = uploadDatas[i][10];
      originDatas[i]['callOffPromotionPercent'] = uploadDatas[i][11];
      originDatas[i]['callOffPromotionAmount'] = uploadDatas[i][12];
      originDatas[i]['deliveryPromotionPercent'] = uploadDatas[i][13];
      originDatas[i]['deliveryPromotionAmount'] = uploadDatas[i][14];
      originDatas[i]['dealerInventoryPercent'] = uploadDatas[i][15];
      originDatas[i]['dealerInventoryAmount'] = uploadDatas[i][16];
      originDatas[i]['cashTotalAmount'] = uploadDatas[i][17];
      originDatas[i]['savingAmount'] = uploadDatas[i][18];
      originDatas[i]['noncashTotalAmount'] = uploadDatas[i][19];
      originDatas[i]['singlecarTotalBudgetPercent'] = uploadDatas[i][20];
      originDatas[i]['singlecarTotalBudgetAmount'] = uploadDatas[i][21];
      if(originDatas[i]['financial']){
        originDatas[i]['financial']['financialPercent'] = uploadDatas[i][22];
        originDatas[i]['financial']['financialAmount'] = uploadDatas[i][23];
      }
      if(originDatas[i]['insurance']){
        originDatas[i]['insurance']['insurancePercent'] = uploadDatas[i][25];
        originDatas[i]['insurance']['insuranceAmount'] = uploadDatas[i][26];
      }
      if( originDatas[i]['replacement']){
        originDatas[i]['replacement']['replacementPercent'] = uploadDatas[i][28];
        originDatas[i]['replacement']['replacementAmount'] = uploadDatas[i][29];
      }
    }

    return originDatas;
  }

  downloadSelectedList(): void {
    let header = ['NOD/DB号', 'Item', '车系', '财务描述', 'MSRP', '奖金大类', '奖金明细类型',
      '年度政策发放依据', '年度政策点数', '年度政策总金额', '条件', '拷车比例', '拷车金额',
      '交车比例', '交车金额', '经销商库存比例', '经销商库存金额', '总金额(现金)', 'Saving金额',
      '总金额(非现金)', '单车总预算比例', '单车总预算金额', '金融比例', '金融金额', '金融总金额',
      '保险比例', '保险金额', '保险总金额', '置换比例', '置换金额', '置换总金额', '延保比例',
      '延保金额', '保养比例', '保养金额', '附件比例', '附件金额', 'onStar比例', 'onStar金额',
      '融资租赁-签约比例', '融资租赁-签约金额', '融资租赁-回购比例', '融资租赁-回购金额'];

    let datas = this.rebuildDownloadList(this.editedDBDatas);

    if (datas.length === 0) {
      window.alert('总金额数据不能被下载');
      return;
    }

    this.data = [header, ...datas];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout: string = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
    saveAs(new Blob([s2ab(wbout)]), 'db_saved_data.xlsx');
  }

  rebuildDownloadList(datas: any) {
    let downloadList = [];

    for (let i = 0; i < datas.length; i++) {
      let isSettingCondition = datas[i]['carDescr'] && datas[i]['carDescr'].length > 0;
      if (isSettingCondition) {
        return [];
      } else {
        let tempData = [];
        tempData.push(datas[i]['nodNumber'] ? datas[i]['nodNumber'] : '');
        tempData.push(datas[i]['nodItemNumber'] ? datas[i]['nodItemNumber'] : '');
        tempData.push(datas[i]['carSeries'] ? datas[i]['carSeries'] : '');
        tempData.push(datas[i]['financialDescription'] ? datas[i]['financialDescription'] : '');
        tempData.push(datas[i]['msrp'] ? datas[i]['msrp'] : '');
        tempData.push(datas[i]['baseType'] ? datas[i]['baseType'] : '');
        tempData.push(datas[i]['rewardTypeDescription'] ? datas[i]['rewardTypeDescription'] : '');
        tempData.push(datas[i]['grantBasis'] ? datas[i]['grantBasis'] : '');
        tempData.push(datas[i]['singleCarPercent'] ? datas[i]['singleCarPercent'] : '');
        tempData.push(datas[i]['totalAmount'] ? datas[i]['totalAmount'] : '');
        tempData.push('');
        tempData.push(datas[i]['callOffPromotionPercent'] ? datas[i]['callOffPromotionPercent'] : '');
        tempData.push(datas[i]['callOffPromotionAmount'] ? datas[i]['callOffPromotionAmount'] : '');
        tempData.push(datas[i]['deliveryPromotionPercent'] ? datas[i]['deliveryPromotionPercent'] : '');
        tempData.push(datas[i]['deliveryPromotionAmount'] ? datas[i]['deliveryPromotionAmount'] : '');
        tempData.push(datas[i]['dealerInventoryPercent'] ? datas[i]['dealerInventoryPercent'] : '');
        tempData.push(datas[i]['dealerInventoryAmount'] ? datas[i]['dealerInventoryAmount'] : '');
        tempData.push(datas[i]['cashTotalAmount'] ? datas[i]['cashTotalAmount'] : '');
        tempData.push(datas[i]['savingAmount'] ? datas[i]['savingAmount'] : '');
        tempData.push(datas[i]['noncashTotalAmount'] ? datas[i]['noncashTotalAmount'] : '');
        tempData.push(datas[i]['singlecarTotalBudgetPercent'] ? datas[i]['singlecarTotalBudgetPercent'] : '');
        tempData.push(datas[i]['singlecarTotalBudgetAmount'] ? datas[i]['singlecarTotalBudgetAmount'] : '');
        tempData.push(datas[i]['financial'] ? datas[i]['financial']['financialPercent'] : '');
        tempData.push(datas[i]['financial'] ? datas[i]['financial']['financialAmount'] : '');
        tempData.push(datas[i]['financialTotalAmount'] ? datas[i]['financialTotalAmount']['financialTotalAmount'] : '');
        tempData.push(datas[i]['insurance'] ? datas[i]['insurance']['insurancePercent'] : '');
        tempData.push(datas[i]['insurance'] ? datas[i]['insurance']['insuranceAmount'] : '');
        tempData.push(datas[i]['insuranceTotalAmount'] ? datas[i]['insuranceTotalAmount']['insuranceTotalAmount'] : '');
        tempData.push(datas[i]['replacement'] ? datas[i]['replacement']['replacementPercent'] : '');
        tempData.push(datas[i]['replacement'] ? datas[i]['replacement']['replacementAmount'] : '');
        tempData.push(datas[i]['replacementTotalAmount'] ? datas[i]['replacementTotalAmount']['replacementTotalAmount'] : '');
        tempData.push(datas[i]['expandInsurance'] ? datas[i]['expandInsurance']['expandInsurancePercent'] : '');
        tempData.push(datas[i]['expandInsurance'] ? datas[i]['expandInsurance']['expandInsuranceAmount'] : '');
        tempData.push(datas[i]['maintain'] ? datas[i]['maintain']['maintainPercent'] : '');
        tempData.push(datas[i]['maintain'] ? datas[i]['maintain']['maintainAmount'] : '');
        tempData.push(datas[i]['attachment'] ? datas[i]['attachment']['attachmentPercent'] : '');
        tempData.push(datas[i]['attachment'] ? datas[i]['attachment']['attachmentAmount'] : '');
        tempData.push(datas[i]['onStar'] ? datas[i]['onStar']['onStarPercent'] : '');
        tempData.push(datas[i]['onStar'] ? datas[i]['onStar']['onStarAmount'] : '');
        tempData.push(datas[i]['assignment'] ? datas[i]['assignment']['assignmentPercent'] : '');
        tempData.push(datas[i]['assignment'] ? datas[i]['assignment']['assignmentAmount'] : '');
        tempData.push(datas[i]['purchase'] ? datas[i]['purchase']['purchasePercent'] : '');
        tempData.push(datas[i]['purchase'] ? datas[i]['purchase']['purchaseAmount'] : '');

        downloadList.push(tempData);
      }
    }

    return downloadList;
  }

  deleteDBItem(data: any) {
    this.store$.dispatch({type: 'DELETE_CREATED_DB_DATA', payload: data});
  }

  modifyDBItem(data: any) {
    this.store$.dispatch({type: 'DELETE_CREATED_DB_DATA', payload: data});
  }

  changeValueByPercent(percent: number) {
    this.store$.dispatch({type: 'GET_SELECTED_DATAS'});
    this.editedDBDatas = this.editedDBDatas.map(data => {
      _.forIn(data, (value, key) => {
        if (key.indexOf('Percent') !== -1) {
          data[key] = percent / 100 * value;
          data[key] = Number(data[key]).toFixed(2);
        } else if (key.indexOf('Amount') !== -1 && key.indexOf('is') === -1) {
          data[key] = percent / 100 * value;
          data[key] = Number(data[key]).toFixed(2);
        } else if (typeof data[key] === 'object') {
          let subdata = data[key];
          _.forIn(subdata, (value, key) => {
            if (key.indexOf('Percent') !== -1) {
              subdata[key] = percent / 100 * value;
              subdata[key] = Number(subdata[key]).toFixed(2);
            } else if (key.indexOf('Amount') !== -1 && key.indexOf('is') === -1) {
              subdata[key] = percent / 100 * value;
              subdata[key] = Number(subdata[key]).toFixed(2);
            }
          })
        }
      });

      return data;
    });
  }

  changeValueByMSRP(data: any) {
    if (typeof data.rowData[data.fieldName] === 'object') {
      data.rowData[data.fieldName][data.fieldName + 'Amount'] =
        data.rowData[data.fieldName][data.fieldName + 'Percent'] / 100 * data.rowData['msrp'];
    } else {
      let amountField = data.fieldName.slice(0, data.fieldName.length - 7);
      data.rowData[amountField + 'Amount'] = data.rowData[data.fieldName] / 100 * data.rowData['msrp'];
    }
  }
}
