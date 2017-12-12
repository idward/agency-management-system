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
  bonusTypeSubs: Subscription;
  saveResultInfo: Message[];

  constructor(private store$: Store<AnnualPolicy[]>, private _route: ActivatedRoute,
              private _router: Router, @Inject('BonusService') private _bonusService) {
    this.datas = this.store$.select('annualPolicyDatas');
  }

  ngOnInit() {
    this.issueBasis = ISSUEBASIS;

    this._route.params.subscribe((parms: Params) => {
      this.nod = new Nod(parms.nodId);
    });

    this._bonusService.getBonusTypesOfAnnualPolicy()
      .subscribe(datas => {
        this.bonusTypeDescription = [];
        this.bonusTypeDescription.push(new OptionItem('请选择...', ''));
        for (let i = 0; i < datas.length; i++) {
          this.bonusTypeDescription.push(new OptionItem(datas[i].dataValue, datas[i].dataName));
        }
      });

    this._bonusService.getData()
      .subscribe(data => {
        this.parsedData = data;
      });

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
  }

  addData() {
    //默认起始时间
    let defaultStartTime = new Date(new Date().getFullYear(), 0, 1);
    //默认结束时间
    let defaultEndtime = new Date(new Date().getFullYear(), 11, 31);

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
    let result = this.checkAnnualPolicy(this.nod.nodList);

    if(!result){
      window.alert('单车点数或总金额不能为空');
      return;
    }

    this._bonusService.saveAnnualPolicyData(this.nod, type)
      .subscribe(data => {
          this.saveResultInfo = [];
          if (type === 1) {
            this.saveResultInfo.push({severity: 'success', summary: '', detail: `${data.code} 保存草稿成功！`});
            setTimeout(() => {
              this._router.navigate(['nodList/myDraftBoxList']);
            }, 3000);
          }
          if (type === 3) {
            this.saveResultInfo.push({severity: 'success', summary: '', detail: `${data.code} 保存成功！`});
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

  checkAnnualPolicy(datas: AnnualPolicy[]): boolean {
    let result = true;

    for (let i = 0; i < datas.length; i++) {
      if(datas[i].carPoint === '0.00' && datas[i].totalAmount === '0.00'){
        result = false;
      }
    }

    return result;
  }

  changeDate(value: any, data: any) {
    let startTime = data['expStartTime'].getTime();
    let endTime = value.getTime();
    if (endTime <= startTime) {
      window.alert('输入结束有效期必须大于输入开始有效期');
      data['expEndTime'] = new Date(startTime + 1000 * 60 * 60 * 24);
    }
  }

  delCurrentRow(data: any) {
    this.store$.dispatch({type: 'DEL_ANNUAL_POLICY', payload: data});
  }

  changeBonusTypeDesc(data: any) {
    console.log(data);
  }

  issueBasisChanged(data: any, annualPolicy: AnnualPolicy) {
    if (data.value !== '') {
      annualPolicy.isAmountUsed = true;
    } else {
      if (annualPolicy.carPoint !== '0.00') {
        annualPolicy.isAmountUsed = true;
      } else {
        annualPolicy.isAmountUsed = false;
      }
    }
    this.store$.dispatch({type: 'UPDATE_ANNUAL_POLICY', payload: annualPolicy});
  }

  valueChangeByPercent(value: any, annualPolicy: AnnualPolicy) {
    let valueCheck = Number(value);
    let valueFixed;

    if (isNaN(valueCheck)) {
      window.alert('非法格式');
      valueFixed = 0;
      annualPolicy.isAmountUsed = false;
    } else {
      if ((valueCheck > 0 && valueCheck > 100) || (value < 0 && valueCheck < -100)) {
        window.alert('单车点数输入超出范围');
        valueFixed = 0;
        annualPolicy.isAmountUsed = false;
      } else if ((valueCheck > 0 && valueCheck <= 100) || (valueCheck < 0 && valueCheck >= -100)) {
        annualPolicy.isAmountUsed = true;
        valueFixed = valueCheck;
      } else if (annualPolicy.issueBasis !== '请选择...' && annualPolicy.issueBasis !== '') {
        annualPolicy.isAmountUsed = true;
        valueFixed = 0;
      } else {
        annualPolicy.isAmountUsed = false;
        valueFixed = 0;
      }
    }

    annualPolicy.carPoint = valueFixed.toFixed(2);
    this.store$.dispatch({type: 'UPDATE_ANNUAL_POLICY', payload: annualPolicy});
  }

  valueChangeByAmount(value: any, annualPolicy: AnnualPolicy) {
    let valueCheck = Number(value);
    let valueFixed;

    if (isNaN(valueCheck)) {
      window.alert('非法格式');
      valueFixed = 0;
      annualPolicy.isPercentUsed = false;
    } else {
      if (valueCheck !== 0) {
        valueFixed = valueCheck;
        annualPolicy.isPercentUsed = true;
      } else {
        valueFixed = 0;
        annualPolicy.isPercentUsed = false;
      }
    }

    annualPolicy.totalAmount = this.formatCurrency(valueFixed);
    this.store$.dispatch({type: 'UPDATE_ANNUAL_POLICY', payload: annualPolicy});
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
