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
  selectedDep: any;
  selectedType: string[];
  startTime: Date;
  endTime: Date;
  showLoading: boolean;
  departments: OptionItem[];
  createdTypes: OptionItem[];
  dbSettingForm: FormGroup;
  nodSearchDialog: boolean = false;
  nodSearchText: string;
  placeholder: string;
  nodSearchedDatas: Observable<any>;
  nodDatas: NodSHData[] = [];
  nodDataSubscription: Subscription;
  nodSHDataSubscription: Subscription;
  selectedNod: any;
  selectedDB: any;
  dataListDialog: boolean = false;
  reportDownloadDialog: boolean = false;
  urlForReportAddress: string;
  fileName: string;
  searchedNODDataList: NodSHData[] = [];
  searchedDBDataList: any;
  isCombination: number = 0;

  constructor(private _fb: FormBuilder, private store$: Store<any>,
              @Inject('BonusService') private _bonusService,
              private _router: Router) {
    this.departments = DEPTS;
    this.createdTypes = TYPES;

    this.dbSettingForm = this._fb.group({
      department: ['', Validators.required],
      selectedType: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      isCalSavingAmount: [false]
    });

    const nodData$ = this.store$.select('nodDatas');
    const nodDataFilter$ = this.store$.select('nodDatasFilter');

    this.nodSearchedDatas = Observable.combineLatest(nodData$, nodDataFilter$,
      (datas: any, filter: any) => datas.filter(filter));

  }

  ngOnInit() {
    this.placeholder = '请输入NOD号或者描述来查询...';
    this.showLoading = false;
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

  onRowSelect(data: any) {
  }

  onRowUnselect(data: any) {
  }

  onHide() {
    this.nodSearchText = '';
    this.store$.dispatch({type: 'EMPTY_NODSEARCHEDDATA'});
  }

  combinationValue(value: number) {
    this.isCombination = value;
  }

  toNodMainPage(formValue: Object) {
    let parsedData = formValue;
    parsedData['isCombination'] = this.isCombination;
    // let dbId = UUID.UUID().split('-')[0];
    let dbId = UUID.UUID();
    let serviceType = 0;
    let seletedNodIds = this.searchedNODDataList.map(data => {
      return data.nodBaseInfoId;
    })
    let params = {
      combination_type: this.isCombination,
      dbNumber: dbId,
      selectedNodIds: seletedNodIds,
      isCalSavingAmount: parsedData['isCalSavingAmount'],
      description: parsedData['description'],
      department: parsedData['department']
    };
    this._bonusService.sendData(params);
    this._router.navigate(['bonus/create-db/promotion', dbId]);
  }

  searchNodNumber() {
    let formData = this.dbSettingForm.value;

    if(!formData['selectedType']){
      window.alert('请选择查询类型');
      return;
    } else if(!formData['startTime']) {
      window.alert('请选择开始时间');
      return;
    } else if(!formData['endTime']){
      window.alert('请选择结束时间');
      return;
    } else if(formData['endTime'].getTime() < formData['startTime'].getTime()){
      window.alert('结束时间不能小于开始时间');
      return;
    }

    this.nodSearchDialog = true;

    if (this.nodSearchText === '') {
      this.placeholder = '请输入NOD号或者描述来查询...';
    }

    if (this.selectedNod && this.selectedNod.length > 0) {
      delete this.selectedNod;
    }

    Observable.fromEvent(document.body.querySelector('#nodSearch'), 'keyup')
      .map(event => event['target'].value)
      .debounceTime(800)
      .distinctUntilChanged()
      .subscribe(keyword => {
        if (keyword.trim() !== '') {
          let selectedDep = this.selectedDep ? this.selectedDep : '';
          let selectedType = this.selectedType ? this.selectedType : '';
          let startTime = this.startTime ? this.startTime.getTime() : '';
          let endTime = this.endTime ? this.endTime.getTime() : '';

          let datas = {
            key: keyword,
            department: selectedDep,
            type: selectedType,
            start: startTime,
            end: endTime
          };

          if (!this.nodSHDataSubscription || this.nodSHDataSubscription.closed === true) {
            this.nodSHDataSubscription = this._bonusService.getNodSearchedDatas(datas)
              .subscribe(nodSearchDatas => {
                this.store$.dispatch({type: 'EMPTY_NODSEARCHEDDATA'});
                this.store$.dispatch({type: 'ADD_NODSEARCHEDDATA', payload: nodSearchDatas});
                this.nodSHDataSubscription.unsubscribe();
              });
          }
        }
      });
  }

  searchDBNumber() {
    console.log('addDBNumber...');
  }

  addNodSearchedData() {
    this.nodSearchDialog = false;
    this.searchedNODDataList = [...this.searchedNODDataList, ...this.selectedNod];
    this.searchedNODDataList = _.uniqBy(this.searchedNODDataList, 'nodBaseInfoId');
  }

  showSearchedDataList() {
    this.dataListDialog = true;
  }

  delNodSearchedDatas(idx: number) {
    let delNodData = this.searchedNODDataList.splice(idx, 1);
    this.selectedNod = _.xor(this.selectedNod, delNodData);

    if (this.selectedNod.length === 0) {
      delete this.selectedNod;
    }
  }

  reportViewDownload() {
    let selectedDep, selectedType;
    if (!_.isNil(this.selectedDep)) {
      selectedDep = this.selectedDep;
    } else {
      window.alert('请选择使用部门');
      return;
    }

    if (!_.isNil(this.selectedType) && this.selectedType.length > 0) {
      selectedType = this.selectedType;
    } else {
      window.alert('请选择查询类型');
      return;
    }

    let startTime = this.startTime ? this.startTime.getTime() : '';
    let endTime = this.endTime ? this.endTime.getTime() : '';

    if (startTime === '') {
      window.alert('请选择开始时间');
      return;
    }

    if (endTime === '') {
      window.alert('请选择结束时间');
      return;
    }

    let nodNumbers = this.selectedNod ? this.selectedNod.map(data => data.nodBaseInfoId) : null;
    let dbNumbers = this.selectedDB ? this.selectedDB.map(data => data.dbBaseInfoId) : null;

    let params = {
      department: selectedDep,
      type: selectedType,
      start: startTime,
      end: endTime,
      nodIds: nodNumbers,
      dbIds: dbNumbers
    };

    this.showLoading = true;

    this._bonusService.searchReportDatas(params)
      .subscribe(data => {
        this.showLoading = false;
        this.reportDownloadDialog = true;
        this.fileName = data['fileName'] + '.xls';
        this.urlForReportAddress = 'http://localhost:8080/service/rest/rewardDb/getExcel/' + data['fileName'];
      });
  }

  closeReportDialog() {
    this.reportDownloadDialog = false;
  }

}
