import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {UUID} from 'angular2-uuid';
import {NodItem} from "../../model/nod/nodItem.model";
import {ReplaySubject, Observable} from "rxjs/Rx";
import {Nod, NodSHData} from "../../model/nod/nod.model";

@Injectable()
export class BonusService {
  parsedData: ReplaySubject<any> = new ReplaySubject<any>();
  private _internalUrl: string = 'http://localhost:3000';
  private _externalUrl: string = 'http://localhost:8080/service/rest/rewardNod';
  // private _publishUrl: string = 'http://10.203.102.119/service/rest/rewardNod';
  //private _url: string = 'http://10.203.102.119/service/rest/rewardNod';
  // private _url: string = 'http://10.203.102.119/service/rest/rewardNod/saveNodInfo';
  private _headers = new Headers({
    'Content-Type': 'application/json'
  });
  private _options = new RequestOptions({headers: this._headers});

  constructor(private _http: Http) {
  }

  sendData(data: any) {
    this.parsedData.next(data);
  }

  getData(): Observable<any> {
    return this.parsedData.map(data => data);
  }

  saveNodInfo(data: any): Observable<any> {
    let nodData = this.transformData(data);
    let body = JSON.stringify(nodData);
    return this._http.post(this._externalUrl + '/saveNodInfo', body, this._options)
      .catch(this._handleError);
  }

  transformData(data: any) {
    let nod = {}, nodItems = [];
    nod['nodNumber'] = data['nodId'];
    nod['description'] = data['desc'];
    nod['useDepartment'] = data['department'];
    nod['nodYear'] = data['nodYear'];
    nod['businessType'] = 1;
    nod['nodState'] = 1;
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
        nodItem['cashTotalAmount'] = spa[0].cash_total_amount;
        nodItem['noncashTotalAmount'] = spa[0].nocash_total_amount;
      }

      nodItem['nodItemCashBO'] = nodItemCash;
      nodItem['nodItemNoncashBO'] = nodItemNoCash;

      nodItems.push(nodItem);
    }
    nod['nodItemBaseBO'] = nodItems;

    return nod;
  }

  buildPromotionAmount(brandName: string, carSeries: string, nodItemNo: string, node: any): any {
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
    noCashBo['nodItemNoncashTypeBO'] = [];

    if (node.parent.parent.financial_total_amount) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 1,
        'amount': node.parent.parent.financial_total_amount,
        'isPromotionAmount': node.parent.parent.financial_total_amount_check ? 'YES' : 'NO'
      });
    }
    if (node.parent.parent.replacement_total_amount) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 3,
        'amount': node.parent.parent.replacement_total_amount,
        'isPromotionAmount': node.parent.parent.replacement_total_amount_check ? 'YES' : 'NO'
      });
    }
    if (node.parent.parent.insurance_total_amount) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 2,
        'amount': node.parent.parent.insurance_total_amount,
        'isPromotionAmount': node.parent.parent.insurance_total_amount_check ? 'YES' : 'NO'
      });
    }

    return {cashBo, noCashBo};
  }

  buildPromotionRatio(brandName: string, carSeries: string, nodItemNo: string, node: any): any {
    let cashBo = {}, noCashBo = {};
    cashBo['carBrand'] = brandName;
    cashBo['carSeries'] = carSeries;
    cashBo['nodItemNumber'] = nodItemNo;
    cashBo['financialDescription'] = node.data.name;
    cashBo['msrp'] = node.data.msrp;
    cashBo['callOffPromotionPercent'] = node.data.kaoche_bili;
    cashBo['isCallOffPromotionPercent'] = node.data.kaoche_bili_check ? 'YES' : 'NO';
    cashBo['callOffPromotionAmount'] = node.data.kaoche_jine;
    cashBo['isCallOffPromotionAmount'] = node.data.kaoche_jine_check ? 'YES' : 'NO';
    cashBo['deliveryPromotionPercent'] = node.data.jiaoche_bili;
    cashBo['isDeliveryPromotionPercent'] = node.data.jiaoche_bili_check ? 'YES' : 'NO';
    cashBo['deliveryPromotionAmount'] = node.data.jiaoche_jine;
    cashBo['isDeliveryPromotionAmount'] = node.data.jiaoche_jine_check ? 'YES' : 'NO';
    cashBo['dealerInventoryPercnet'] = node.data.store_bili;
    cashBo['isDealerInventoryPercnet'] = node.data.store_bili_check ? 'YES' : 'NO';
    cashBo['dealerInventoryAmount'] = node.data.store_jine;
    cashBo['isDealerInventoryAmount'] = node.data.store_jine_check ? 'YES' : 'NO';
    noCashBo['nodItemNumber'] = nodItemNo;
    noCashBo['carBrand'] = brandName;
    noCashBo['carSeries'] = carSeries;
    noCashBo['financialDescription'] = node.data.name;
    noCashBo['msrp'] = node.data.msrp;
    noCashBo['singlecarTotalBudgetPercent'] = node.data.singleCar_bili;
    noCashBo['singlecarTotalBudgetAmount'] = node.data.singleCar_jine;
    noCashBo['nodItemNoncashTypeBO'] = [];
    if (node.data.financial_bili) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 1,
        'percent': node.data.financial_bili,
        'amount': node.data.financial_jine,
        'isPromotionAmount': node.data.financial_jine_check ? 'YES' : 'NO'
      });
    }
    if (node.data.replacement_bili) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 3,
        'percent': node.data.replacement_bili,
        'amount': node.data.replacement_jine,
        'isPromotionAmount': node.data.replacement_jine_check ? 'YES' : 'NO'
      });
    }
    if (node.data.insurance_bili) {
      noCashBo['nodItemNoncashTypeBO'].push({
        'noncashType': 2,
        'percent': node.data.insurance_bili,
        'amount': node.data.insurance_jine,
        'isPromotionAmount': node.data.insurance_jine_check ? 'YES' : 'NO'
      });
    }
    return {cashBo, noCashBo};
  }

  createNODItem(serviceType: string): NodItem {
    let nodItem_id = UUID.UUID().split('-')[0];
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

  getNodSearchedDatas(): Observable<NodSHData[]> {
    // return this._http.get(this._externalUrl + '/getNodBaseInfoByCodeAndDescr/1', this._options)
    return this._http.get(this._internalUrl + '/nod', this._options)
      // .map(data => data.json().data as NodSHData[])
      .map(data => data.json() as NodSHData[])
      .catch(this._handleError);
  }

  saveAnnualPolicyData(data: any): Observable<any> {
    let body = JSON.stringify(data);
    return this._http.post(this._internalUrl, body, this._options)
      .map(data => data.json())
      .catch(this._handleError);
  }

  getNodDetailByIds(combinationType: number, nodIds: any): Observable<any> {
    let body = {type: combinationType, ids: nodIds};
    // return this._http.post(this._externalUrl + '/getNodDetailByIds', JSON.stringify(body), this._options)
    return this._http.get(this._internalUrl + '/nodDetail', this._options)
      .map(res => res.json().data)
      .catch(this._handleError);
  }

  private _handleError(error: any): Observable<any> {
    console.log('sever error:', error.json());
    return Observable.throw(error.message || error);
  }

}
