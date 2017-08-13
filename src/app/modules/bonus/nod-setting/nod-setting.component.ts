import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UUID} from 'angular2-uuid';
import {Subject} from "rxjs/Subject";

import {DEPTS} from "../../../data/optionItem/optionItem.data";
import {OptionItem} from "../../../model/optionItem/optionItem.model";
import {YearItem} from "../../../model/year/yearItem.model";
import {Year} from "../../../model/year/year.model";

@Component({
  selector: 'app-nod-setting',
  templateUrl: './nod-setting.component.html',
  styleUrls: ['./nod-setting.component.scss']
})

export class NodSettingComponent implements OnInit {
  selectedDep:any;
  selectedYear:any;
  departments:OptionItem[];
  years:YearItem[];
  nodSettingForm:FormGroup;

  constructor(private _fb:FormBuilder, private _router:Router,
              @Inject('BonusService') private _bonusService) {
    this.departments = DEPTS;
  }

  ngOnInit():void {
    this.nodSettingForm = this._fb.group({
      nod_number: ['', Validators.required],
      description: ['', Validators.required],
      department: ['', Validators.required],
      year: ['', Validators.required]
    });

    this.years = this.productYear(1990, 2025);
  }

  toNodMainPage(formValue:Object) {
    console.log(formValue);
    this._bonusService.sendData(formValue);
    let nodId = UUID.UUID().split('-')[0];
    this._router.navigate(['bonus/create-nod', nodId]);
  }

  /**
   * 年份生成
   * @param startTime
   * @param endTime
   */
  private productYear(startTime:number, endTime:number):Array<YearItem> {
    let lt_years:YearItem[] = [], gt_years:YearItem[] = [];
    let currentYear = new Date().getFullYear();
    if (startTime && startTime < currentYear) {
      for (let i = currentYear; i >= startTime; i--) {
        lt_years = [...lt_years, new YearItem(String(i), new Year(String(i), i))];
      }
    }
    if (endTime && endTime > currentYear) {
      for (let i = endTime; i > currentYear; i--) {
        gt_years = [...gt_years, new YearItem(String(i), new Year(String(i), i))];
      }
    }
    let final_years = [...gt_years, ...lt_years];
    return final_years;
  }


}
