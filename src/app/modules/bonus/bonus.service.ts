import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {UUID} from 'angular2-uuid';
import {NodItem} from "../../model/nod/nodItem.model";
import {ReplaySubject, Observable} from "rxjs/Rx";

@Injectable()
export class BonusService {
  parsedData: ReplaySubject<any> = new ReplaySubject<any>();

  constructor() {
  }

  sendData(data: any) {
    this.parsedData.next(data);
  }

  getData():Observable<any> {
    return this.parsedData.map(data => data);
  }

  createNODItem(serviceType: string): NodItem {
    let nodItem_id = UUID.UUID().split('-')[0];
    let nodItem, nodItemData;

    if (serviceType === 'PROMOTIONAL_RATIO') {
      nodItemData = {
        cartree_model:[],
        saved_cartree_model:[],
        promotional_ratio: [],
        saved_promotional_ratio:[],
        setting_condition: {}
      }
      nodItem = new NodItem(nodItem_id, serviceType, nodItemData);
    } else if (serviceType === 'PROMOTIONAL_AMOUNT') {
      nodItemData = {
        cartree_model:[],
        saved_cartree_model:[],
        promotional_amount: [],
        saved_promotional_amount:[],
        setting_condition: {}
      }
      nodItem = new NodItem(nodItem_id, serviceType, nodItemData);
    }
    return nodItem;
  }

}
