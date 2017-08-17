import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {UUID} from 'angular2-uuid';
import {NodItem} from "../../model/nod/nodItem.model";

@Injectable()
export class BonusService {
  parsedData: Subject<any> = new Subject<any>();

  constructor() {
  }

  sendData(data: any) {
    this.parsedData.next(data);
  }

  getData() {
    return this.parsedData.subscribe(data => console.log(data));
  }

  createNODItem(serviceType: string): NodItem {
    let nodItem_id = UUID.UUID().split('-')[0];
    let nodItem, nodItemData;

    if (serviceType === 'PROMOTIONAL_RATIO') {
      nodItemData = {
        cartree_model:[],
        setting_condition: {},
        promotional_ratio: []
      }
      nodItem = new NodItem(nodItem_id, serviceType, nodItemData);
    } else if (serviceType === 'PROMOTIONAL_AMOUNT') {
      nodItemData = {
        cartree_model:[],
        setting_condition: {},
        promotional_amount: []
      }
      nodItem = new NodItem(nodItem_id, serviceType, nodItemData);
    }
    return nodItem;
  }

}
