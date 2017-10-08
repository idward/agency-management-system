import {Injectable} from '@angular/core';
// import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {HttpClient} from '@angular/common/http';

import {ReplaySubject, Observable} from "rxjs/Rx";
import {UUID} from 'angular2-uuid';
import * as _ from 'lodash';

import {NodItem} from "../../model/nod/nodItem.model";
import {Nod, NodSHData} from "../../model/nod/nod.model";

@Injectable()
export class BonusService {
  private _parsedData:ReplaySubject<any> = new ReplaySubject<any>(1);
  private _internalUrl:string = 'http://localhost:3000';
  private _externalUrl:string = 'http://localhost:8080/service/rest';
  private _publishUrl:string = 'http://10.203.102.119/service/rest';
  private _url:string;

  constructor(private _http:HttpClient) {
    this._url = this.setAPIUrl(this._internalUrl);
    console.log('bonus:', this._url);
  }

  setAPIUrl(url:string):string {
    return url;
  }

  sendData(data:any) {
    this._parsedData.next(data);
  }

  getData():Observable<any> {
    return this._parsedData.map(data => data);
  }

  saveNodInfo(data:any, submitType:number):Observable<any> {
    let nodData = this.transformData(data, submitType);
    let body = JSON.stringify(nodData);
    return this._http.post(this._url + '/rewardNod/saveNodInfo', body)
    // .map(data => data.json())
      .catch(this._handleError);
  }

  transformData(data:any, submitType:number) {
    let nod = {}, nodItems = [];
    if (submitType === 1) {
      nod['nodDraftNumber'] = data['nodId'];
    } else {
      nod['nodNumber'] = data['nodId'];
    }
    nod['description'] = data['desc'];
    nod['useDepartment'] = data['department'];
    nod['nodYear'] = data['nodYear'];
    nod['businessType'] = 1;
    nod['nodState'] = submitType;
    for (let i = 0; i < data.nodList.length; i++) {
      let nodItem = {}, nodItemCash = [], nodItemNoCash = [];
      nodItem['nodBaseItemNumber'] = data.nodList[i]['nodItem_id'];
      nodItem['itemBusinessType'] = data.nodList[i]['nodItem_type'] === 'PROMOTIONAL_RATIO' ? 1 : 2;
      nodItem['startDate'] = data.nodList[i]['nodItem_data']['setting_condition']['startTime'].getTime();
      nodItem['endDate'] = data.nodList[i]['nodItem_data']['setting_condition']['endTime'].getTime();
      nodItem['releaseDueDate'] = data.nodList[i]['nodItem_data']['setting_condition']['releaseTime'].getTime();
      nodItem['itemDescription'] = data.nodList[i]['nodItem_data']['setting_condition']['description'];
      nodItem['isPapidProcess'] = data.nodList[i]['nodItem_data']['setting_condition']['isFastProcess'] ? 'YES' : 'NO';
      nodItem['isApprovalDb'] = data.nodList[i]['nodItem_data']['setting_condition']['isApproval'] ? 'YES' : 'NO';
      nodItem['nodItemBaseInfoState'] = submitType;

      if (data.nodList[i]['nodItem_data']['saved_promotional_ratio']) {
        let spr = data.nodList[i]['nodItem_data']['saved_promotional_ratio'];
        for (let j = 0; j < spr.length; j++) {
          let brandName = spr[j].data.name;
          // let first = this.buildCashBo(nodItem['nodBaseItemNumber'], spr[i]);
          // nodItemCash.push(first.cashBo);
          // nodItemNoCash.push(first.noCashBo);
          if (spr[j].children) {
            let sChild = spr[j].children;
            for (let k = 0; k < sChild.length; k++) {
              let carSeries = sChild[k].data.name;
              // let second = this.buildCashBo(nodItem['nodBaseItemNumber'], sChild[k]);
              // nodItemCash.push(second.cashBo);
              // nodItemNoCash.push(second.noCashBo);
              if (sChild[k].children) {
                let ssChild = sChild[k].children;
                for (let h = 0; h < ssChild.length; h++) {
                  let third = this.buildPromotionRatio(brandName, carSeries, nodItem['nodBaseItemNumber'], ssChild[h]);
                  nodItemCash.push(third.cashBo);
                  nodItemNoCash.push(third.noCashBo);
                }
              }
            }
          }
        }
      }
      if (data.nodList[i]['nodItem_data']['saved_promotional_amount']) {
        let noCashBo = {};
        let spa = data.nodList[i]['nodItem_data']['saved_promotional_amount'];

        for (let j = 0; j < spa.length; j++) {
          let brandName = spa[j].data.name;
          if (spa[j].children) {
            let sChild = spa[j].children;
            for (let k = 0; k < sChild.length; k++) {
              let carSeries = sChild[k].data.name;
              if (sChild[k].children) {
                let ssChild = sChild[k].children;
                for (let h = 0; h < ssChild.length; h++) {
                  let third = this.buildPromotionAmount(brandName, carSeries, nodItem['nodBaseItemNumber'], ssChild[h]);
                  nodItemCash.push(third.cashBo);
                  nodItemNoCash.push(third.noCashBo);
                }
              }
            }
          }
        }
        nodItem['cashTotalAmount'] = this.convertToNormalValue(spa[0].cash_total_amount);
        nodItem['noncashTotalAmount'] = this.convertToNormalValue(spa[0].nocash_total_amount);

        nodItem['nodTotalNoncashTypeBO'] = [];

        if (spa[0]['financial_total_amount']) {
          nodItem['nodTotalNoncashTypeBO'].push({
            'noncashType': 1,
            'totalAmount': this.convertToNormalValue(spa[0]['financial_total_amount']),
            'isPromotionTotalAmount': spa[0]['financial_total_amount_check'] ? 'YES' : 'NO'
          });
        }
        if (spa[0]['replacement_total_amount']) {
          nodItem['nodTotalNoncashTypeBO'].push({
            'noncashType': 3,
            'totalAmount': this.convertToNormalValue(spa[0]['replacement_total_amount']),
            'isPromotionTotalAmount': spa[0]['replacement_total_amount_check'] ? 'YES' : 'NO'
          });
        }
        if (spa[0]['insurance_total_amount']) {
          nodItem['nodTotalNoncashTypeBO'].push({
            'noncashType': 2,
            'totalAmount': this.convertToNormalValue(spa[0]['insurance_total_amount']),
            'isPromotionTotalAmount': spa[0]['insurance_total_amount_check'] ? 'YES' : 'NO'
          });
        }
      }

      nodItem['nodItemCashBO'] = nodItemCash;
      nodItem['nodItemNoncashBO'] = nodItemNoCash;

      nodItems.push(nodItem);
    }
    nod['nodItemBaseBO'] = nodItems;

    return nod;
  }

  buildPromotionAmount(brandName:string, carSeries:string, nodItemNo:string, node:any):any {
    let cashBo = {}, noCashBo = {};
    cashBo['carBrand'] = brandName;
    cashBo['carSeries'] = carSeries;
    cashBo['nodItemNumber'] = nodItemNo;
    cashBo['financialDescription'] = node.data.name;
    cashBo['msrp'] = node.data.msrp;

    noCashBo['carBrand'] = brandName;
    noCashBo['carSeries'] = carSeries;
    noCashBo['nodItemNumber'] = nodItemNo;
    noCashBo['financialDescription'] = node.data.name;
    noCashBo['msrp'] = node.data.msrp;
    // noCashBo['nodTotalNoncashTypeBO'] = [];

    // if (node.parent.parent.financial_total_amount) {
    //   noCashBo['nodTotalNoncashTypeBO'].push({
    //     'noncashType': 1,
    //     'amount': this.convertToNormalValue(node.parent.parent.financial_total_amount),
    //     'isPromotionAmount': node.parent.parent.financial_total_amount_check ? 'YES' : 'NO'
    //   });
    // }
    // if (node.parent.parent.replacement_total_amount) {
    //   noCashBo['nodTotalNoncashTypeBO'].push({
    //     'noncashType': 3,
    //     'amount': this.convertToNormalValue(node.parent.parent.replacement_total_amount),
    //     'isPromotionAmount': node.parent.parent.replacement_total_amount_check ? 'YES' : 'NO'
    //   });
    // }
    // if (node.parent.parent.insurance_total_amount) {
    //   noCashBo['nodTotalNoncashTypeBO'].push({
    //     'noncashType': 2,
    //     'amount': this.convertToNormalValue(node.parent.parent.insurance_total_amount),
    //     'isPromotionAmount': node.parent.parent.insurance_total_amount_check ? 'YES' : 'NO'
    //   });
    // }

    return {cashBo, noCashBo};
  }

  buildPromotionRatio(brandName:string, carSeries:string, nodItemNo:string, node:any):any {
    let cashBo = {}, noCashBo = {};
    cashBo['carBrand'] = brandName;
    cashBo['carSeries'] = carSeries;
    cashBo['nodItemNumber'] = nodItemNo;
    cashBo['financialDescription'] = node.data.name;
    cashBo['msrp'] = node.data.msrp;
    cashBo['callOffPromotionPercent'] = this.convertToNormalPercent(node.data.kaoche_bili);
    cashBo['isCallOffPromotionPercent'] = node.data.kaoche_bili_check ? 'YES' : 'NO';
    cashBo['callOffPromotionAmount'] = this.convertToNormalValue(node.data.kaoche_jine);
    cashBo['isCallOffPromotionAmount'] = node.data.kaoche_jine_check ? 'YES' : 'NO';
    cashBo['deliveryPromotionPercent'] = this.convertToNormalPercent(node.data.jiaoche_bili);
    cashBo['isDeliveryPromotionPercent'] = node.data.jiaoche_bili_check ? 'YES' : 'NO';
    cashBo['deliveryPromotionAmount'] = this.convertToNormalValue(node.data.jiaoche_jine);
    cashBo['isDeliveryPromotionAmount'] = node.data.jiaoche_jine_check ? 'YES' : 'NO';
    cashBo['dealerInventoryPercnet'] = this.convertToNormalPercent(node.data.store_bili);
    cashBo['isDealerInventoryPercnet'] = node.data.store_bili_check ? 'YES' : 'NO';
    cashBo['dealerInventoryAmount'] = this.convertToNormalValue(node.data.store_jine);
    cashBo['isDealerInventoryAmount'] = node.data.store_jine_check ? 'YES' : 'NO';
    noCashBo['nodItemNumber'] = nodItemNo;
    noCashBo['carBrand'] = brandName;
    noCashBo['carSeries'] = carSeries;
    noCashBo['financialDescription'] = node.data.name;
    noCashBo['msrp'] = node.data.msrp;
    noCashBo['singlecarTotalBudgetPercent'] = this.convertToNormalPercent(node.data.singleCar_bili);
    noCashBo['singlecarTotalBudgetAmount'] = this.convertToNormalValue(node.data.singleCar_jine);
    noCashBo['nodItemNoncashTypeBO'] = [];
    if (node.data.financial_bili) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 1,
        'percent': this.convertToNormalPercent(node.data.financial_bili),
        'amount': this.convertToNormalValue(node.data.financial_jine),
        'isPromotionAmount': node.data.financial_jine_check ? 'YES' : 'NO'
      });
    }
    if (node.data.replacement_bili) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 3,
        'percent': this.convertToNormalPercent(node.data.replacement_bili),
        'amount': this.convertToNormalValue(node.data.replacement_jine),
        'isPromotionAmount': node.data.replacement_jine_check ? 'YES' : 'NO'
      });
    }
    if (node.data.insurance_bili) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 2,
        'percent': this.convertToNormalPercent(node.data.insurance_bili),
        'amount': this.convertToNormalValue(node.data.insurance_jine),
        'isPromotionAmount': node.data.insurance_jine_check ? 'YES' : 'NO'
      });
    }
    return {cashBo, noCashBo};
  }

  convertToNormalValue(value:string) {
    let result = '';
    let v = value.slice(0, value.indexOf('.'));
    let arr = v.split(',');
    for (let i = 0; i < arr.length; i++) {
      result += arr[i];
    }
    return result;
  }

  convertToNormalPercent(value:string) {
    return value.slice(0, value.indexOf('.'));
  }

  createNODItem(serviceType:string):NodItem {
    let nodItem_id = UUID.UUID();
    let nodItem, nodItemData;

    if (serviceType === 'PROMOTIONAL_RATIO') {
      nodItemData = {
        cartree_model: [],
        saved_cartree_model: [],
        promotional_ratio: [],
        saved_promotional_ratio: [],
        setting_condition: {}
      }
      nodItem = new NodItem(nodItem_id, serviceType, nodItemData);
    } else if (serviceType === 'PROMOTIONAL_AMOUNT') {
      nodItemData = {
        cartree_model: [],
        saved_cartree_model: [],
        promotional_amount: [],
        saved_promotional_amount: [],
        setting_condition: {}
      }
      nodItem = new NodItem(nodItem_id, serviceType, nodItemData);
    }
    return nodItem;
  }

  getNodSearchedDatas(keyword:string):Observable<NodSHData[]> {
    // return this._http.get(this._url + '/rewardNod/getNodBaseInfoByCodeAndDescr?key=' + keyword)
    return this._http.get(this._url + '/nod')
      .map(res => res as NodSHData[])
      // .map(res => res['data'] as NodSHData[])
      .catch(this._handleError);
  }

  saveAnnualPolicyData(nodData:Nod, submitType:number):Observable<any> {
    let annualPolicyData = this.transformAPDatas(nodData, submitType);
    let body = JSON.stringify(annualPolicyData);
    return this._http.post(this._url + '/rewardNod/nodSaveAnnualPolicyInfo', body)
      .catch(this._handleError);
  }

  transformAPDatas(nodData:Nod, submitType:number) {
    let data = {};
    if (submitType === 1) {
      data['nodDraftNumber'] = nodData['nodId'];
    } else {
      data['nodNumber'] = nodData['nodId'];
    }
    data['description'] = nodData.desc;
    data['useDepartment'] = nodData.department;
    data['businessType'] = 2;
    data['nodYear'] = nodData.nodYear;
    data['nodState'] = submitType;
    data['nodAnnualPolicyBO'] = nodData.nodList.map(data => {
      let temp = {};
      temp['nodItemNumber'] = data['id'];
      temp['rewardTypeDescription'] = data['bonusTypeDesc'];
      temp['grantBasis'] = data['issueBasis'];
      temp['singleCarPercent'] = this.convertToNormalPercent(data['carPoint']);
      temp['totalAmount'] = this.convertToNormalValue(data['totalAmount']);
      temp['startDate'] = data['expStartTime'].getTime();
      temp['endDate'] = data['expEndTime'].getTime();
      temp['remark'] = data['remarks'];
      return temp;
    });
    return data;
  }

  getNodDetailByIds(combinationType:number, nodIds:any):Observable<any> {
    let body = {type: combinationType, ids: nodIds};
    return this._http.get(this._url + '/nodDetail')
      .catch(this._handleError);
  }

  private _handleError(error:any):Observable<any> {
    if (error.status < 400 || error.status == 500) {
      return Observable.throw(new Error(error.status));
    } else if (error.status === 400 || error.status === 415) {
      return Observable.throw(new Error(error.status));
    }
  }
}
