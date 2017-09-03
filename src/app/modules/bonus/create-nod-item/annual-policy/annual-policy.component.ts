import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Rx";
import {AnnualPolicy} from "../../../../model/annual-policy/annualPolicy.model";
import {OptionItem} from "../../../../model/optionItem/optionItem.model";
import {BONUSTYPEDESC ,ISSUEBASIS} from "../../../../data/optionItem/optionItem.data";

@Component({
  selector: 'app-annual-policy',
  templateUrl: './annual-policy.component.html',
  styleUrls: ['./annual-policy.component.scss']
})
export class NodAnnualPolicyComponent implements OnInit {
  datas: Observable<AnnualPolicy[]>;
  bonusTypeDescription: OptionItem[];
  issueBasis:OptionItem[];
  startTime:Date;

  constructor(private store$: Store<AnnualPolicy[]>) {
    this.datas = this.store$.select('annualPolicyDatas');
  }

  ngOnInit() {
    this.bonusTypeDescription = BONUSTYPEDESC;
    this.issueBasis = ISSUEBASIS;
    this.store$.dispatch({type:'GET_ANNUAL_POLICY'});

    this.datas.subscribe(data => console.log(data));
  }

  addData() {
    let tempData:AnnualPolicy[] = [];
    let annualPolicy = new AnnualPolicy();
    annualPolicy.bonusTypeDesc = '请选择奖金类型';
    annualPolicy.issueBasis = '请选择发放依据';
    annualPolicy.carPoint = 0;
    annualPolicy.totalAmount = 0;
    annualPolicy.expStartTime = null;
    annualPolicy.expEndTime = null;
    annualPolicy.remarks = '';
    tempData.push(annualPolicy);
    this.store$.dispatch({type: 'ADD_ANNUAL_POLICY', payload: tempData});
  }

  saveData() {
    this.store$.dispatch({type: 'SAVE_ANNUAL_POLICY', payload: ''});
  }

}
