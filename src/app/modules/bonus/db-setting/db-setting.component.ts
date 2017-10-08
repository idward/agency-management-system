import {Component, Inject, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UUID} from 'angular2-uuid';

import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Subscription} from "rxjs/Subscription";
import {Store} from "@ngrx/store";

import {OptionItem} from "../../../model/optionItem/optionItem.model";
import {DEPTS, TYPES} from "../../../data/optionItem/optionItem.data";
import {NodSHData} from "../../../model/nod/nod.model";
import * as _ from 'lodash';

@Component({
  selector: 'app-db-setting',
  templateUrl: './db-setting.component.html',
  styleUrls: ['./db-setting.component.scss']
})
export class DbSettingComponent implements OnInit, OnChanges, OnDestroy {
  selectedDep:any;
  selectedType:any;
  startTime:Date;
  endTime:Date;
  departments:OptionItem[];
  createdTypes:OptionItem[];
  dbSettingForm:FormGroup;
  nodSearchDialog:boolean = false;
  nodSearchText:string;
  placeholder:string;
  nodSearchedDatas:Observable<any>;
  nodDatas:NodSHData[] = [];
  nodDataSubscription:Subscription;
  nodSHDataSubscription:Subscription;
  selectedNod:any;
  dataListDialog:boolean = false;
  searchedNODDataList:NodSHData[] = [];
  searchedDBDataList:any;
  isCombination:number = 0;

  constructor(private _fb:FormBuilder, private store$:Store<any>,
              @Inject('BonusService') private _bonusService,
              private _router:Router) {
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
      (datas:any, filter:any) => datas.filter(filter));

  }

  ngOnInit() {
    this.placeholder = '请输入NOD号或者描述来查询...';
  }

  ngOnChanges() {
  }


  ngOnDestroy() {
  }

  onFocus() {
    this.placeholder = '';
  }

  onBlur() {
    if (this.nodSearchText === undefined || this.nodSearchText === '') {
      this.placeholder = '请输入NOD号或者描述来查询...';
    }
  }

  onRowSelect(data:any) {
  }

  onRowUnselect(data:any) {
  }

  onHide() {
    this.nodSearchText = '';
    this.store$.dispatch({type: 'EMPTY_NODSEARCHEDDATA'});
  }

  combinationValue(value:number) {
    this.isCombination = value;
  }

  toNodMainPage(formValue:Object) {
    let parsedData = formValue;
    parsedData['isCombination'] = this.isCombination;
    let createdType = formValue['createdType'];
    let dbId = UUID.UUID().split('-')[0];
    if (createdType === 'PROMOTION') {
      let serviceType = 0;
      let seletedNodIds = this.searchedNODDataList.map(data => {
        return data.nodBaseInfoId;
      })
      let params = {
        bonus_type: serviceType,
        combination_type: this.isCombination,
        selectedNodIds: seletedNodIds
      };
      this._bonusService.sendData(params);
      this._router.navigate(['bonus/create-db/promotion', dbId]);
    } else if (createdType === 'ANNUAL_POLICY') {
      let serviceType = 1;
      this._router.navigate(['bonus/create-db/annual-policy', dbId]);
    }
  }

  searchNodNumber() {
    this.nodSearchDialog = true;

    if (this.nodSearchText === '') {
      this.placeholder = '请输入NOD号或者描述来查询...';
    }

    if(this.selectedNod && this.selectedNod.length > 0){
      delete this.selectedNod;
    }

    Observable.fromEvent(document.body.querySelector('#nodSearch'), 'keyup').take(1)
      .map(event => event['target'].value)
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(keyword => {
        this.nodSHDataSubscription = this._bonusService.getNodSearchedDatas(keyword)
          .subscribe(nodSearchDatas => {
            console.log(nodSearchDatas);
            this.store$.dispatch({type: 'ADD_NODSEARCHEDDATA', payload: nodSearchDatas});
            this.nodSHDataSubscription.unsubscribe();
          });
      });
  }

  searchDBNumber() {
    console.log('addDBNumber...');
  }

  addNodSearchedData() {
    this.searchedNODDataList = [...this.searchedNODDataList, ...this.selectedNod];
    this.searchedNODDataList = _.uniq(this.searchedNODDataList);
    console.log('nodDataList:', this.searchedNODDataList);
  }

  showSearchedDataList() {
    this.dataListDialog = true;
  }

  delNodSearchedDatas(idx:number) {
    let delNodData = this.searchedNODDataList.splice(idx, 1);
    this.selectedNod = _.xor(this.selectedNod, delNodData);
  }

}
