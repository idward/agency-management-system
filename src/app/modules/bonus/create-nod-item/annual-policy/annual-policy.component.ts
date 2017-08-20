import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Rx";
import {AnnualPolicy} from "../../../../model/annual-policy/annualPolicy.model";

@Component({
  selector: 'app-annual-policy',
  templateUrl: './annual-policy.component.html',
  styleUrls: ['./annual-policy.component.scss']
})
export class AnnualPolicyComponent implements OnInit {
  datas:Observable<AnnualPolicy[]>;

  constructor(private store$:Store<AnnualPolicy[]>) {
    this.datas = this.store$.select('annualPolicyDatas');
  }

  ngOnInit() {
      this.datas.subscribe(data => console.log(data));
  }

  addData(){
    let tempData = [];
    let newData = new AnnualPolicy();
    this.store$.dispatch({type:'ADD_ANNUAL_POLICY',payload:tempData.push(newData)});
  }

  saveData(){
    this.store$.dispatch({type:'SAVE_ANNUAL_POLICY',payload:''});
  }

}
