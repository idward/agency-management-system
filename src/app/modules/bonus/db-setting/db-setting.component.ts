import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {subscribeOn} from "rxjs/operator/subscribeOn";
import {OptionItem} from "../../../model/optionItem/optionItem.model";
import {DEPTS, TYPES} from "../../../data/optionItem/optionItem.data";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs/Subscription";
import {NodSHData} from "../../../model/nod/nod.model";

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
  display: boolean = false;
  nodSearchText: string;
  placeholder: string;
  nodSearchedDatas: Observable<any>;
  nodDatas:NodSHData[] = [];
  nodDataSubscription:Subscription;
  selectedNod:any;

  constructor(private _fb: FormBuilder, private store$: Store<any>,
              @Inject('BonusService') private _bonusService) {
    this.departments = DEPTS;
    this.createdTypes = TYPES;

    this.dbSettingForm = this._fb.group({
      department: ['', Validators.required],
      createdType: ['', Validators.required],
      startTime: [''],
      endTime: ['']
    });

    const nodData$ = this.store$.select('nodDatas');
    const nodDataFilter$ = this.store$.select('nodDatasFilter');

    this.nodSearchedDatas = Observable.combineLatest(nodData$, nodDataFilter$,
      (datas: any, filter: any) => datas.filter(filter));

  }

  ngOnInit() {
    this.placeholder = '请输入NOD号或者描述来查询...';

    if(!this.nodDataSubscription){
      this.nodDataSubscription = this.nodSearchedDatas.subscribe(data => {
        console.log('nodSearchedData:', data);
        this.nodDatas = data;
      });
    }
  }

  onFocus() {
    this.placeholder = '';
  }

  onBlur() {
    if (this.nodSearchText === undefined || this.nodSearchText === '') {
      this.placeholder = '请输入NOD号或者描述来查询...';
    }
  }

  toNodMainPage(formValue: Object) {
    console.log(formValue);
  }

  addNodNumber() {
    this.display = true;

    if(this.nodDatas && this.nodDatas.length === 0){
      this._bonusService.getNodSearchedDatas()
        .subscribe(nodDatas => {
          this.store$.dispatch({type: 'GET_NODSEARCHEDDATA', payload: nodDatas});
        });
    }
  }

  addDBNumber() {
    console.log('addDBNumber...');
  }

}
