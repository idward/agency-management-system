import { Injectable } from '@angular/core';
import {Subject} from "rxjs/Subject";

@Injectable()
export class BonusService {
  parsedData:Subject<any> = new Subject<any>();

  constructor() {}

  sendData(data:any){
    this.parsedData.next(data);
  }

  getData(){
    return this.parsedData.subscribe(data=>console.log(data));
  }

  createNODItem(){
    let nod = {

    }
  }

}
