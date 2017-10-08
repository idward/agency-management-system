import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {UUID} from 'angular2-uuid';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import * as _ from 'lodash';

import {OptionItem} from "../../../../model/optionItem/optionItem.model";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class DBPromotionComponent implements OnInit, OnDestroy {
  dbNumber: string;
  bonusType: string;
  combinationType: number;
  selectedNodIds: any;
  selectedType: string;
  selectedNodItems: any = [];
  commonSetting: any;
  dynamicTypes: any;
  nodItemOptions: OptionItem[] = [];
  datas: Observable<any>;
  selectedDBDatas: Observable<any>;
  createdDBDatas: Observable<any>;
  editedDBDatas: any;
  nodItemsSubscription: Subscription;
  selDBDataSubscription: Subscription;
  createdDBDataSubscription: Subscription;

  constructor(private _route: ActivatedRoute, private store$: Store<any>,
              @Inject('BonusService') private _bonusService) {

    const dbDatas$ = this.store$.select('dbDatas');
    const dbFilterDatas$ = this.store$.select('dbFilterDatas');

    const dbSelDatas$ = this.store$.select('dbSelDatas');
    const dbSelFilterDatas$ = this.store$.select('dbSelFilterDatas');

    const dbCreatedDatas$ = this.store$.select('dbCreatedDatas');
    const dbCreatedFilterDatas$ = this.store$.select('dbCreatedFilterDatas');

    this.datas = Observable.combineLatest(dbDatas$, dbFilterDatas$,
      (datas: any, filter: any) => datas.filter(filter));

    this.selectedDBDatas = Observable.combineLatest(dbSelDatas$, dbSelFilterDatas$,
      (datas: any, filter: any) => datas.map(filter));

    this.createdDBDatas = Observable.combineLatest(dbCreatedDatas$, dbCreatedFilterDatas$,
      (datas: any, filter: any) => datas.filter(filter));

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
    this.nodItemOptions = [new OptionItem('促销比例', 'PROMOTIONAL_RATIO'), new OptionItem('促销金额', 'PROMOTIONAL_AMOUNT')];
    debugger;

    this.commonSetting = {
      'desc': '',
      'fastProcess': false,
      'bonusType': '',
      'startTime': '',
      'endTime': ''
    }

    this._bonusService.getData()
      .subscribe(data => {
        this.bonusType = data.bonus_type === 0 ? '促销' : '年度政策';
        this.combinationType = data.combination_type;
        this.selectedNodIds = data.selectedNodIds;
      });

    this._route.params.subscribe((params: Params) => {
      this.dbNumber = params.dbId;
    });

    this.datas.subscribe(datas => console.log('finalDatas:', datas));

    if (!this.createdDBDataSubscription) {
      this.createdDBDataSubscription = this.createdDBDatas.subscribe(datas => {
        console.log('createdDBDatas:', datas);
      });
    }

    if (!this.selDBDataSubscription) {
      this.selDBDataSubscription = this.selectedDBDatas.subscribe(datas => {
        console.log('selectedDBDatas:', datas);
        this.editedDBDatas = datas.map(data => {
          let temp = {};
          for (var p in data) {
            if (data[p] && typeof data[p] === 'object') {
              temp[p] = _.assign({}, data[p]);
              //delete data[p];
            }
          }
          return _.assign({}, data, temp);
        });
      });
    }

    if (!this.nodItemsSubscription) {
      this.nodItemsSubscription = this._bonusService.getNodDetailByIds(this.combinationType, this.selectedNodIds)
        .subscribe(data => {
            let datas = data.map(subdata => {
              let noCashDatas = subdata.nodItemNoncashTypeBO.map(ssubdata => {
                let tempData = {};
                let basicData = this.dynamicTypes[ssubdata.noncashType * 1 + 1];
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

            this.store$.dispatch({type: 'ADD_DB_DATAS', payload: datas});
          }
        );
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
  }

  createNewItem(datas: any) {
    this.store$.dispatch({type: 'ADD_SELECTED_DATAS', payload: datas});
  }

  createNewDB() {
    let newNod = {}, finalCreatedDBDatas = [];
    newNod['nodItemNumber'] = UUID.UUID();
    newNod['setting_condition'] = this.commonSetting;
    newNod['promotional_ratio'] = this.editedDBDatas;
    finalCreatedDBDatas.push(newNod);
    this.store$.dispatch({type: 'ADD_CREATED_DB_DATAS', payload: finalCreatedDBDatas});

    this.store$.dispatch({type: 'EMPTY_ALL_SELDBDATAS'});
    this.selectedNodItems = [];
  }

  changeValueByPercent(percent: number) {
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
