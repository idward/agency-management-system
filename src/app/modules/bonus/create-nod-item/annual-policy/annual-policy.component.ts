import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {UUID} from 'angular2-uuid';

import {Observable} from "rxjs/Rx";
import {Subscription} from "rxjs/Subscription";

import {AnnualPolicy} from "../../../../model/annual-policy/annualPolicy.model";
import {OptionItem} from "../../../../model/optionItem/optionItem.model";
import {BONUSTYPEDESC, ISSUEBASIS} from "../../../../data/optionItem/optionItem.data";

@Component({
  selector: 'app-annual-policy',
  templateUrl: './annual-policy.component.html',
  styleUrls: ['./annual-policy.component.scss']
})
export class NodAnnualPolicyComponent implements OnInit,OnDestroy {
  datas: Observable<AnnualPolicy[]>;
  bonusTypeDescription: OptionItem[];
  issueBasis: OptionItem[];
  annualPolicyData: AnnualPolicy[];
  apSubscription: Subscription;

  constructor(private store$: Store<AnnualPolicy[]>,
              @Inject('BonusService') private _bonusService) {
    this.datas = this.store$.select('annualPolicyDatas');
  }

  ngOnInit() {
    this.bonusTypeDescription = BONUSTYPEDESC;
    this.issueBasis = ISSUEBASIS;
    this.store$.dispatch({type: 'GET_ANNUAL_POLICY'});

    if(!this.apSubscription){
      this.apSubscription = this.datas.subscribe(data => {
        console.log(data);
        this.annualPolicyData = data;
      });
    }
  }

  ngOnDestroy() {
    this.store$.dispatch({type:'EMPTY_ANNUAL_POLICY'});
    if(this.apSubscription){
      this.apSubscription.unsubscribe();
    }
  }

  addData() {
    //默认起始时间
    let defaultStartTime = new Date();
    defaultStartTime.setMonth(0);
    defaultStartTime.setDate(1);
    defaultStartTime = new Date(defaultStartTime);
    //默认结束时间
    let defaultEndtime = new Date();
    defaultEndtime.setMonth(11);
    defaultEndtime.setDate(31);
    defaultEndtime = new Date(defaultEndtime);

    let tempData: AnnualPolicy[] = [];
    let annualPolicy = new AnnualPolicy();
    annualPolicy.id = UUID.UUID();
    annualPolicy.bonusTypeDesc = '请选择...';
    annualPolicy.issueBasis = '请选择...';
    annualPolicy.carPoint = '0.00';
    annualPolicy.totalAmount = '0.00';
    annualPolicy.isPercentUsed = false;
    annualPolicy.isAmountUsed = false;
    annualPolicy.expStartTime = defaultStartTime;
    annualPolicy.expEndTime = defaultEndtime;
    annualPolicy.remarks = '';
    tempData.push(annualPolicy);
    this.store$.dispatch({type: 'ADD_ANNUAL_POLICY', payload: tempData});
  }

  saveData() {
    this._bonusService.saveAnnualPolicyData(this.annualPolicyData)
      .subscribe(data => console.log(data));
  }

  delCurrentRow(data: any) {
    this.store$.dispatch({type: 'DEL_ANNUAL_POLICY', payload: data});
  }

  issueBasisChanged(data: any, annualPolicy: AnnualPolicy) {
    if (data.value !== '请选择...') {
      annualPolicy.isAmountUsed = true;
      this.store$.dispatch({type: 'UPDATE_ANNUAL_POLICY', payload: annualPolicy});
    }
  }

  valueChangeByPercent(value: any, annualPolicy: AnnualPolicy) {
    if (value !== '0.00') {
      annualPolicy.isAmountUsed = true;
      annualPolicy.carPoint = Number(value).toFixed(2);
      this.store$.dispatch({type: 'UPDATE_ANNUAL_POLICY', payload: annualPolicy});
    }
  }

  valueChangeByAmount(value: any, annualPolicy: AnnualPolicy) {
    if (value !== '0.00') {
      annualPolicy.isPercentUsed = true;
      annualPolicy.totalAmount = this.formatCurrency(value);
      this.store$.dispatch({type: 'UPDATE_ANNUAL_POLICY', payload: annualPolicy});
    }
  }

  formatCurrency(num) {
    let nums = num.toString().replace(/\$|\,/g, '');
    if (isNaN(nums)) {
      nums = "0";
    }
    let sign: boolean = (nums == (nums = Math.abs(nums)));
    nums = Math.floor(nums * 100 + 0.50000000001);
    let cents: any = nums % 100;
    nums = Math.floor(nums / 100).toString();
    if (cents < 10) {
      cents = "0" + cents;
    }
    for (let i = 0; i < Math.floor((nums.length - (1 + i)) / 3); i++) {
      nums = nums.substring(0, nums.length - (4 * i + 3)) + ',' +
        nums.substring(nums.length - (4 * i + 3));
    }
    return (((sign) ? '' : '-') + nums + '.' + cents);
  }
}
