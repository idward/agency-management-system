import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Store} from "@ngrx/store";
import {UUID} from 'angular2-uuid';

import {Observable} from "rxjs/Rx";
import {Subscription} from "rxjs/Subscription";

import {AnnualPolicy} from "../../../../model/annual-policy/annualPolicy.model";
import {OptionItem} from "../../../../model/optionItem/optionItem.model";
import {BONUSTYPEDESC, ISSUEBASIS} from "../../../../data/optionItem/optionItem.data";
import {Nod} from "../../../../model/nod/nod.model";
import {Message} from "primeng/primeng";

@Component({
  selector: 'app-annual-policy',
  templateUrl: './annual-policy.component.html',
  styleUrls: ['./annual-policy.component.scss']
})
export class NodAnnualPolicyComponent implements OnInit, OnDestroy {
  nod: Nod;
  parsedData: any;
  datas: Observable<AnnualPolicy[]>;
  bonusTypeDescription: OptionItem[];
  issueBasis: OptionItem[];
  apSubscription: Subscription;
  parsedDataSubscription: Subscription;
  saveResultInfo: Message[];

  constructor(private store$: Store<AnnualPolicy[]>, private _route: ActivatedRoute,
              private _router: Router, @Inject('BonusService') private _bonusService) {
    this.datas = this.store$.select('annualPolicyDatas');
  }

  ngOnInit() {
    this.bonusTypeDescription = BONUSTYPEDESC;
    this.issueBasis = ISSUEBASIS;
    this.store$.dispatch({type: 'GET_ANNUAL_POLICY'});

    this._route.params.subscribe((parms: Params) => {
      this.nod = new Nod(parms.nodId);
    });

    if (!this.parsedDataSubscription) {
      this.parsedDataSubscription = this._bonusService.getData()
        .subscribe(data => {
          this.parsedData = data;
        });
    }

    if (!this.apSubscription) {
      this.apSubscription = this.datas.subscribe(data => {
        if (data && data.length > 0) {
          this.nod.createdType = this.parsedData['createdType'] === 'ANNUAL_POLICY' ? '2' : '1';
          this.nod.desc = this.parsedData['description'];
          this.nod.department = this.parsedData['department'];
          this.nod.nodYear = this.parsedData['year'];
          this.nod.nodList = data;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.apSubscription) {
      this.store$.dispatch({type: 'EMPTY_ANNUAL_POLICY'});
      this.apSubscription.unsubscribe();
    }

    if (this.parsedDataSubscription) {
      this.parsedDataSubscription.unsubscribe();
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

  saveData(type: number) {
    // let nodDatasByAnnualPolicy = this.transformAPDatas(this.annualPolicyData);
    this._bonusService.saveAnnualPolicyData(this.nod, type)
      .subscribe(data => {
          this.saveResultInfo = [];
          if (type === 1) {
            this.saveResultInfo.push({severity: 'success', summary: '', detail: '保存草稿成功！'});
          }
          if (type === 3) {
            this.saveResultInfo.push({severity: 'success', summary: '', detail: '保存成功！'});
            setTimeout(() => {
              this._router.navigate(['bonus']);
            }, 3000);
          }
        },
        err => {
          if (err.message === '500') {
            this.saveResultInfo = [];
            if (type === 1) {
              this.saveResultInfo.push({severity: 'error', summary: '', detail: '保存草稿失败！'});
            }
            if (type === 3) {
              let errorStatus = err.message;
              this.saveResultInfo.push({severity: 'error', summary: '', detail: '保存失败！'});
              setTimeout(function () {
                this._router.navigate(['error', errorStatus]);
              }.bind(this, errorStatus), 3000);
            }
          } else {
            this.saveResultInfo = [];
            if (type === 1) {
              this.saveResultInfo.push({severity: 'error', summary: '', detail: '保存草稿失败！'});
            }
            if (type === 3) {
              let errorStatus = err.message;
              this.saveResultInfo.push({severity: 'error', summary: '', detail: '保存失败！'});
              setTimeout(function () {
                this._router.navigate(['error', errorStatus]);
              }.bind(this, errorStatus), 3000);
            }
          }
        }
      );
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
