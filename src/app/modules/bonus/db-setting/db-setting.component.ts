import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {subscribeOn} from "rxjs/operator/subscribeOn";
import {OptionItem} from "../../../model/optionItem/optionItem.model";
import {DEPTS, TYPES} from "../../../data/optionItem/optionItem.data";

@Component({
  selector: 'app-db-setting',
  templateUrl: './db-setting.component.html',
  styleUrls: ['./db-setting.component.scss']
})
export class DbSettingComponent implements OnInit {
  selectedDep: any;
  selectedType: any;
  startTime: Date;
  endTime: Date;
  departments: OptionItem[];
  createdTypes: OptionItem[];
  dbSettingForm: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.departments = DEPTS;
    this.createdTypes = TYPES;
  }

  ngOnInit() {
    this.dbSettingForm = this._fb.group({
      department: [null, Validators.required],
      // createdType: ['', Validators.required]
    });
  }

  toNodMainPage(formValue: Object) {
    console.log(formValue);
  }

}
