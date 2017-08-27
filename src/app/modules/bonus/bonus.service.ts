import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {UUID} from 'angular2-uuid';
import {NodItem} from "../../model/nod/nodItem.model";
import {ReplaySubject, Observable} from "rxjs/Rx";
import {Nod} from "../../model/nod/nod.model";

@Injectable()
export class BonusService {
  parsedData:ReplaySubject<any> = new ReplaySubject<any>();

  constructor(private _http:Http) {
  }

  sendData(data:any) {
    this.parsedData.next(data);
  }

  getData():Observable<any> {
    return this.parsedData.map(data => data);
  }

  saveNodInfo(data:any) {
    let nodData = this.transformData(data);
    console.log('submit:',nodData);
  }

  transformData(data:any) {
    let nod = {}, nodItems = [];
    nod['nodNumber'] = data['nodId'];
    nod['description'] = data['desc'];
    nod['useDepartment'] = data['department'];
    nod['nodYear'] = data['nodYear'];
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
          let cashBo = {}, noCashBo = {};
          cashBo['carSeries'] = spr[i].data.name;
          cashBo['msrp'] = spr[i].data.msrp;
          cashBo['callOffPromotionPercent'] = spr[i].data.kaoche_bili;
          cashBo['isCallOffPromotionPercent'] = spr[i].data.kaoche_bili_check ? 'YES' : 'NO';
          cashBo['callOffPromotionAmount'] = spr[i].data.kaoche_jine;
          cashBo['isCallOffPromotionAmount'] = spr[i].data.kaoche_jine_check ? 'YES' : 'NO';
          cashBo['deliveryPromotionPercent'] = spr[i].data.jiaoche_bili;
          cashBo['isDeliveryPromotionPercent'] = spr[i].data.jiaoche_bili_check ? 'YES' : 'NO';
          cashBo['deliveryPromotionAmount'] = spr[i].data.jiaoche_jine;
          cashBo['isDeliveryPromotionAmount'] = spr[i].data.jiaoche_jine_check ? 'YES' : 'NO';
          cashBo['dealerInventoryPercnet'] = spr[i].data.store_bili;
          cashBo['isDealerInventoryPercnet'] = spr[i].data.store_bili_check ? 'YES' : 'NO';
          cashBo['dealerInventoryAmount'] = spr[i].data.store_jine;
          cashBo['isDealerInventoryAmount'] = spr[i].data.store_jine_check ? 'YES' : 'NO';
          nodItemCash.push(cashBo);
          noCashBo['carSeries'] = spr[i].data.name;
          noCashBo['msrp'] = spr[i].data.msrp;
          noCashBo['singlecarTotalBudgetPercent'] = spr[i].data.singleCar_bili;
          noCashBo['singlecarTotalBudgetAmount'] = spr[i].data.singleCar_jine;
          noCashBo['nodItemNoncashTypeBO'] = [];
          if (spr[i].data.financial_bili) {
            noCashBo['nodItemNoncashTypeBO'].push({
              'noncashType': 1,
              'percent': spr[i].data.financial_bili,
              'amount': spr[i].data.financial_jine,
              'check': spr[i].data.financial_jine_check
            });
          }
          if (spr[i].data.replacement_bili) {
            noCashBo['nodItemNoncashTypeBO'].push({
              'noncashType': 3,
              'percent': spr[i].data.replacement_bili,
              'amount': spr[i].data.replacement_jine,
              'check': spr[i].data.replacement_jine_check
            });
          }
          if (spr[i].data.insurance_bili) {
            noCashBo['nodItemNoncashTypeBO'].push({
              'noncashType': 2,
              'percent': spr[i].data.insurance_bili,
              'amount': spr[i].data.insurance_jine,
              'check': spr[i].data.insurance_jine_check
            });
          }
          nodItemNoCash.push(noCashBo);
        }
      }
      if (data.nodList[i]['nodItem_data']['saved_promotional_amount']) {
        let noCashBo = {};
        let spa = data.nodList[i]['nodItem_data']['saved_promotional_amount'];
        noCashBo['nodItemNoncashTypeBO'] = [];
        if (spa[0].financial_total_amount) {
          noCashBo['nodItemNoncashTypeBO'].push({
            'noncashType': 1,
            'amount': spa[0].financial_total_amount,
            'check': spa[0].financial_total_amount_check
          });
        }
        if (spa[0].replacement_total_amount) {
          noCashBo['nodItemNoncashTypeBO'].push({
            'noncashType': 3,
            'amount': spa[0].replacement_total_amount,
            'check': spa[0].replacement_total_amount_check
          });
        }
        if (spa[0].insurance_total_amount) {
          noCashBo['nodItemNoncashTypeBO'].push({
            'noncashType': 2,
            'amount': spa[0].insurance_total_amount,
            'check': spa[0].insurance_total_amount_check
          });
        }
        nodItemNoCash.push(noCashBo);
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

  createNODItem(serviceType:string):NodItem {
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

}
