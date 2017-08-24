import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UUID} from 'angular2-uuid';
import {Subject} from "rxjs/Subject";

import {TYPES, DEPTS} from "../../../data/optionItem/optionItem.data";
import {OptionItem} from "../../../model/optionItem/optionItem.model";
import {YearItem} from "../../../model/year/yearItem.model";
import {Year} from "../../../model/year/year.model";

@Component({
  selector: 'app-nod-setting',
  templateUrl: './nod-setting.component.html',
  styleUrls: ['./nod-setting.component.scss']
})

export class NodSettingComponent implements OnInit {
  selectedType:any;
  selectedDep:any;
  selectedYear:any;
  createdTypes:OptionItem[];
  departments:OptionItem[];
  years:YearItem[];
  nodSettingForm:FormGroup;

  constructor(private _fb:FormBuilder, private _router:Router,
              @Inject('BonusService') private _bonusService) {
    this.createdTypes = TYPES;
    this.departments = DEPTS;
  }

  ngOnInit():void {
    this.nodSettingForm = this._fb.group({
      description: ['', Validators.required],
      createdType: ['', Validators.required],
      department: ['', Validators.required],
      year: ['', Validators.required]
    });

    this.years = this.productYear(1990, 2025);
  }

  toNodMainPage(formValue:Object) {
    // console.log(formValue);
    let createdType = formValue['createdType'];
    this._bonusService.sendData(formValue);
    let nodId = UUID.UUID().split('-')[0];
    if (createdType === 'PROMOTION') {
      this._router.navigate(['bonus/create-nod/promotion', nodId]);
    } else if (createdType === 'ANNUAL_POLICY') {
      this._router.navigate(['bonus/create-nod/annual-policy', nodId]);
    }
  }

  private productYear(startTime:number, endTime:number):Array<YearItem> {
    let lt_years:YearItem[] = [], gt_years:YearItem[] = [];
    let currentYear = new Date().getFullYear();
    if (startTime && startTime < currentYear) {
      for (let i = currentYear; i >= startTime; i--) {
        lt_years = [...lt_years, new YearItem(String(i), String(i))];
      }
    }
    if (endTime && endTime > currentYear) {
      for (let i = endTime; i > currentYear; i--) {
        gt_years = [...gt_years, new YearItem(String(i), String(i))];
      }
    }
    let final_years = [...gt_years, ...lt_years];
    return final_years;
  }

}
