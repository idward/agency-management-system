import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {UUID} from 'angular2-uuid';
import {NodItem} from "../../model/nod/nodItem.model";
import {ReplaySubject, Observable} from "rxjs/Rx";

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
  }

  transformData(data:any) {
    let nod = {}, nodItems = [];
    nod['nodNumber'] = data['nodId'];
    nod['description'] = data['desc'];
    nod['useDepartment'] = data['department'];
    nod['nodYear'] = data['nodYear'];
    nod['nodState'] = 1;
    nod['nodItemBaseBO'] = nodItems;
    for (let i = 0; i < data.nodList.length; i++) {
      let nodItem = {};
      nodItem['nodBaseItemNumber'] = data.nodList[i]['nodItem_id'];
      nodItem['itemBusinessType'] = data.nodList[i]['nodItem_type'] === 'PROMOTIONAL_RATIO' ? 1 : 2;

    }
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
