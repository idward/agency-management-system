import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UUID} from 'angular2-uuid';
import * as _ from 'lodash';

import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Store} from "@ngrx/store";

import {TreeNode, Message, MenuItem} from 'primeng/primeng';
import {OptionItem} from "../../../../model/optionItem/optionItem.model";
import {ReleaseLocation} from "../../../../data/optionItem/optionItem.data";

@Component({
  selector: 'app-create-dbr-item',
  templateUrl: './create-dbr-item.component.html',
  styleUrls: ['./create-dbr-item.component.scss']
})
export class CreateDbrItemComponent implements OnInit, OnDestroy {
  commonSetting: object;
  items: MenuItem[];
  bonusTypeItemOptions: OptionItem[];
  locationOptions: OptionItem[];
  uploadListSource: string;
  listForDBDialog: boolean;
  uploadConditionDialog: boolean;
  uploadResultDialog: boolean;
  singleBatchNumberDialog: boolean;
  historyBatchNumberDialog: boolean;
  isSourceFromBonusList: boolean;
  selectedBatchNumber: any;
  batchNumbers: string[];
  matchResult: boolean;
  isApprovedDBrDatas: boolean;
  placeholder: string;
  dbListSearchText: string;
  dbQueryListDatas: object[];
  selectedDBItem: object;
  selectedDBItemTreeDatas: TreeNode[] = [];
  selectedDBItemLabels: string[];
  flag: string;
  DBItemTreeDatas: TreeNode[];
  finalDBItemDatas: TreeNode[];
  selectedDBItemTreeData: TreeNode;
  uploadListDatas: object[];
  matchResultDatas: object[];
  uploadResultDatas: object[];
  queryListResult: object[];
  dbrCashList: object[];
  saveResultInfo: Message[];
  queryResultDatas: Observable<any>;
  dbQueryList: Observable<any>;
  dbItemDatas: Observable<any>;
  dbQueryListSubscription: Subscription;
  dbQueryListResultSubs: Subscription;
  dbItemDataSubscription: Subscription;
  queryResultDataSubs: Subscription;

  constructor(@Inject('BonusService') private _bonusService, private _router: Router,
              private store$: Store<any>) {
    const dbQueryList$ = this.store$.select('dbQueryListDatas');
    const dbQueryListFilter$ = this.store$.select('dbQueryListFilterDatas');

    const dbItemDatas$ = this.store$.select('selectedDbItemDatas');
    const dbItemFilterDatas$ = this.store$.select('selectedDbItemFilterDatas');

    this.dbQueryList = Observable.combineLatest(dbQueryList$, dbQueryListFilter$,
      (datas: any, filter: any) => datas.filter(filter));

    this.dbItemDatas = Observable.combineLatest(dbItemDatas$, dbItemFilterDatas$,
      (datas: any, filter: any) => datas.filter(filter));

    this.queryResultDatas = this.store$.select('queryResultDatas');

  }

  ngOnInit() {
    this.commonSetting = {
      description: '',
      bonusType: '',
      startTime: null,
      endTime: null,
      needToHold: false,
      location: ''
    };

    this.placeholder = '请输入DB号';

    this.items = [
      {
        label: '指定批次号', command: () => {
        this.previewSingleBatchNumber();
      }
      },
      {
        label: '浏览已存在批次号', command: () => {
        this.previewHistoryBatchNumber();
      }
      }
    ]

    this._bonusService.getBonusTypeByDBR()
      .subscribe(datas => {
        let bonusTypes: OptionItem[] = [];
        for (let i = 0; i < datas.length; i++) {
          bonusTypes.push(new OptionItem(datas[i].name, datas[i].code));
        }
        this.bonusTypeItemOptions = bonusTypes;
      });

    this.locationOptions = ReleaseLocation;

    if (!this.dbQueryListSubscription) {
      this.dbQueryListSubscription = this.dbQueryList.subscribe(datas => {
        this.dbQueryListDatas = datas;
      });
    }

    if (!this.dbItemDataSubscription) {
      this.dbItemDataSubscription = this.dbItemDatas.subscribe(datas => {
        this.finalDBItemDatas = datas;
      });
    }

    if (!this.queryResultDataSubs) {
      this.queryResultDataSubs = this.queryResultDatas.subscribe(datas => {
        this.queryListResult = datas;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.dbQueryListSubscription) {
      this.store$.dispatch({type: 'EMPTY_QUERY_DBLIST'});
      this.dbQueryListSubscription.unsubscribe();
    }

    if (this.dbItemDataSubscription) {
      this.store$.dispatch({type: 'EMPTY_SELECTED_DBRDATAS'});
      this.dbItemDataSubscription.unsubscribe();
    }

    if (this.queryResultDataSubs) {
      this.store$.dispatch({type: 'EMPTY_QUERY_RESULT_DATAS'});
      this.queryResultDataSubs.unsubscribe();
    }
  }

  setCommonSetting(data: any) {
    this.commonSetting = Object.assign({}, this.commonSetting, data);
  }

  onHide() {
    this.dbListSearchText = '';
    this.selectedDBItem = null;
    this.DBItemTreeDatas = null;
    this.store$.dispatch({type: 'EMPTY_QUERY_DBLIST'});
    this.store$.dispatch({type: 'EMPTY_SELECTED_DBRDATAS'});
  }

  onBlur() {
  }

  onFocus() {
  }

  showDBList() {
    this.listForDBDialog = true;

    Observable.fromEvent(document.body.querySelector('#dbListSearch'), 'keyup')
      .map(event => event['target'].value)
      .debounceTime(800)
      .distinctUntilChanged()
      .subscribe(keyword => {
        if (keyword.trim() !== '') {
          if (!this.dbQueryListResultSubs || this.dbQueryListResultSubs.closed === true) {
            this.dbQueryListResultSubs = this._bonusService.getDbDetailForDbrCreate(keyword)
              .subscribe(datas => {
                if (!_.isNil(this.dbQueryListDatas) && this.dbQueryListDatas.length > 0) {
                  this.store$.dispatch({type: 'EMPTY_QUERY_DBLIST'});
                }
                this.store$.dispatch({type: 'ADD_QUERY_DBLIST', payload: datas});
                this.dbQueryListResultSubs.unsubscribe();
              });
          }
        }
      });
  }

  addDBItemData() {
    let selectedDataItems = this.selectedDBItem;
    this.DBItemTreeDatas = this.buildDBItemTreeData(selectedDataItems);
    this.selectedDBItemTreeDatas = [];
  }

  private buildDBItemTreeData(selectedDBItem: object): TreeNode[] {
    let finalDBItems = [];
    let node = {}, tempData = {};
    tempData['dbNumber'] = selectedDBItem['dbNumber'];
    tempData['dbBaseInfoId'] = selectedDBItem['dbBaseInfoId'];
    tempData['description'] = selectedDBItem['description'];
    node['label'] = selectedDBItem['dbNumber'];
    node['data'] = tempData;
    node['selected'] = false;
    node['expanded'] = true;
    node['children'] = [];

    let subDBItems = selectedDBItem['items'];

    for (let i = 0; i < subDBItems.length; i++) {
      let subNode = {}, subData = {};
      subData['itemName'] = subDBItems[i]['itemName'];
      subData['dbItemBaseInfoId'] = subDBItems[i]['dbItemBaseInfoId'];
      subNode['label'] = subDBItems[i]['itemName'];
      subNode['data'] = subData;
      subNode['selected'] = false;
      subNode['expanded'] = true;
      subNode['children'] = [];
      let rewards = subDBItems[i]['rewards'];
      for (let j = 0; j < rewards.length; j++) {
        let ssubNode = {}, ssubData = {};
        ssubData['code'] = rewards[j]['code'];
        ssubData['name'] = rewards[j]['name'];
        ssubData['value'] = rewards[j]['value'];

        ssubNode['label'] = rewards[j]['name'];
        ssubNode['data'] = ssubData;
        ssubNode['selected'] = false;
        ssubNode['expanded'] = true;

        subNode['children'].push(ssubNode);
      }

      node['children'].push(subNode);
    }
    finalDBItems.push(node);
    return finalDBItems;
  }

  selectDBItem(data: any) {
    let selectedDBItem = data.value;
    this.selectedDBItem = Object.assign({}, selectedDBItem[0]);
  }

  showDBItemData() {
    if (!_.isNil(this.selectedDBItemTreeDatas) && this.selectedDBItemTreeDatas.length === 0) {
      window.alert('请选择数据');
      return;
    }

    this.selectedDBItemLabels = this.selectedDBItemTreeDatas.map(dbItem => {
      return dbItem.label;
    });

    let newDBItemTreeDatas = this.rebuildNewDBItemTreeDatas(this.DBItemTreeDatas);
    let filteredDBItemDatas = this.filterDBItemData(newDBItemTreeDatas, this.selectedDBItemLabels);
    this.store$.dispatch({type: 'ADD_SELECTED_DBRDATAS', payload: filteredDBItemDatas});
  }

  rebuildNewDBItemTreeDatas(dbItemTreeData: TreeNode[]): TreeNode[] {
    let newDbItemTreeData = [];
    for (let i = 0; i < dbItemTreeData.length; i++) {
      let dBItem = {};
      dBItem['label'] = dbItemTreeData[i]['label'];
      dBItem['expanded'] = dbItemTreeData[i]['expanded'];
      dBItem['selected'] = dbItemTreeData[i]['selected'];
      dBItem['data'] = Object.assign({}, dbItemTreeData[i]['data']);
      dBItem['children'] = [];
      let children = dbItemTreeData[i]['children'];
      for (let j = 0; j < children.length; j++) {
        let subDBItem = {};
        subDBItem['label'] = children[j]['label'];
        subDBItem['expanded'] = children[j]['expanded'];
        subDBItem['selected'] = children[j]['selected'];
        subDBItem['data'] = Object.assign({}, children[j]['data']);
        subDBItem['children'] = [];
        let subChildren = children[j]['children'];
        for (let k = 0; k < subChildren.length; k++) {
          let ssubDBItem = {};
          ssubDBItem['label'] = subChildren[k]['label'];
          ssubDBItem['expanded'] = subChildren[k]['expanded'];
          ssubDBItem['selected'] = subChildren[k]['selected'];
          ssubDBItem['data'] = Object.assign({}, subChildren[k]['data']);
          subDBItem['children'].push(ssubDBItem);
        }
        dBItem['children'].push(subDBItem);
      }
      newDbItemTreeData.push(dBItem)
    }

    return newDbItemTreeData;
  }

  filterDBItemData(dbItemTreeData: TreeNode[], selectedLabels: string[]): TreeNode {
    let filteredDBItem = [];

    let firstItems = dbItemTreeData.filter(dbitem => {
      for (let i = 0; i < selectedLabels.length; i++) {
        if (dbitem.label === selectedLabels[i]) {
          return true;
        }
      }
    });

    if (firstItems && firstItems.length === 0) {
      let firstItemChildren = dbItemTreeData[0].children;
      if (firstItemChildren && firstItemChildren.length > 0) {
        let secondItems = firstItemChildren.filter(subDBItem => {
          for (let i = 0; i < selectedLabels.length; i++) {
            if (subDBItem.label === selectedLabels[i]) {
              return true;
            }
          }
        });

        if (secondItems && secondItems.length === 0) {
          let tempData = [];
          for (let j = 0; j < firstItemChildren.length; j++) {
            let secondItemChildren = firstItemChildren[j].children;
            if (secondItemChildren && secondItemChildren.length > 0) {
              let thirdItems = secondItemChildren.filter(ssubDBItem => {
                for (let i = 0; i < selectedLabels.length; i++) {
                  if (ssubDBItem.label === selectedLabels[i]) {
                    return true;
                  }
                }
              });

              if (thirdItems && thirdItems.length > 0) {
                firstItemChildren[j].children = thirdItems;
                tempData.push(firstItemChildren[j]);
              }
            }
          }
          dbItemTreeData[0].children = tempData;
          filteredDBItem = dbItemTreeData;

        } else {
          dbItemTreeData[0].children = secondItems;
          filteredDBItem = dbItemTreeData;
        }
      }
    } else {
      filteredDBItem = firstItems;
    }

    return filteredDBItem;
  }

  sendDBItemData() {
    let datas = this.rebuildDbDetailSummaryInfo(this.finalDBItemDatas);
    this._bonusService.getDbDetailOfSummaryInfo({itemes: datas})
      .subscribe(data => {
        this.flag = data.flag;
        let datas = data['list'];
        this.store$.dispatch({type: 'ADD_QUERY_RESULT_DATAS', payload: datas});
      });
    this.listForDBDialog = false;
    this.onHide();
  }

  rebuildDbDetailSummaryInfo(dbItemDatas: TreeNode[]) {
    let items = [];

    for (let i = 0; i < dbItemDatas.length; i++) {
      let children = dbItemDatas[i].children;
      let item = {};
      for (let j = 0; j < children.length; j++) {
        item['dbItemId'] = children[j]['data']['dbItemBaseInfoId'];
        item['rewards'] = [];

        let subChildren = children[j]['children'];
        for (let k = 0; k < subChildren.length; k++) {
          item['rewards'].push(subChildren[k]['data']['code']);
        }
      }
      items.push(item);
    }

    return items;
  }

  uploadList() {
    this.uploadConditionDialog = true;
  }

  getBonusList() {

  }

  querySingleBatchNumber(batchNumber: string) {
    let choiceDBList = this.rebuildUploadData(this.queryListResult);
    this._bonusService.getDipsBonusInfoByStaticReportId(batchNumber, choiceDBList)
      .subscribe(result => {
          let {data, message} = result;
          if (result.success) {
            this.isSourceFromBonusList = true;
            this.uploadResultDialog = true;
            this.uploadResultDatas = data.dbrDealerCashListBO;
            this.matchResult = data.checkFlag;
            this.uploadListSource = data.listSource;
          } else {
            this.saveResultInfo = [];
            this.saveResultInfo.push({severity: 'error', summary: '', detail: `${message}`})
          }
        },
        err => {
          this.saveResultInfo = [];
          let errorStatus = err.message;
          this.saveResultInfo.push({severity: 'error', summary: '', detail: '数据异常！'});
          setTimeout(function () {
            this._router.navigate(['error', errorStatus]);
          }.bind(this, errorStatus), 3000);
        });
  }

  previewSingleBatchNumber() {
    this.singleBatchNumberDialog = true;
  }

  previewHistoryBatchNumber() {
    this.historyBatchNumberDialog = true;

    this._bonusService.queryDipsDealerListBatchNumber()
      .subscribe(result => {
          let {data, message} = result;
          if (result.success) {
            let batchNumbers = data.map(batchnumber => {
              return {'batchNumber': batchnumber};
            })
            this.batchNumbers = batchNumbers;
          } else {
            this.saveResultInfo = [];
            this.saveResultInfo.push({severity: 'error', summary: '', detail: `${message}`})
          }
        },
        err => {
          this.saveResultInfo = [];
          let errorStatus = err.message;
          this.saveResultInfo.push({severity: 'error', summary: '', detail: '数据异常！'});
          setTimeout(function () {
            this._router.navigate(['error', errorStatus]);
          }.bind(this, errorStatus), 3000);
        });
  }

  queryHistoryBatchNumber() {
    this.historyBatchNumberDialog = false;
    let {batchNumber} = this.selectedBatchNumber;
    this._bonusService.queryDipsDealerListForBatchNumber(batchNumber)
      .subscribe(result => {
          let {data, message} = result;
          if (result.success) {
            this.isSourceFromBonusList = true;
            this.uploadResultDialog = true;
            this.uploadResultDatas = data.dbrDealerCashListBO;
            this.matchResult = data.checkFlag;
            this.uploadListSource = data.listSource;
          } else {
            this.saveResultInfo = [];
            this.saveResultInfo.push({severity: 'error', summary: '', detail: `${message}`})
          }
        },
        err => {
          this.saveResultInfo = [];
          let errorStatus = err.message;
          this.saveResultInfo.push({severity: 'error', summary: '', detail: '数据异常！'});
          setTimeout(function () {
            this._router.navigate(['error', errorStatus]);
          }.bind(this, errorStatus), 3000);
        });

  }

  getBonusListCommand() {

  }

  getUploadMatchedResult() {
    let matchedData = this.buildMatchedDBInfo(this.queryListResult, this.uploadResultDatas);

    this._bonusService.dealerUploadDbrListAutoMatchDbInfo(matchedData)
      .subscribe(datas => {
        let choicedDatas = datas['dbrChoiceDbListBO'];
        this.dbrCashList = datas['dbrDealerCashListBO'];
        this.store$.dispatch({type: 'EMPTY_QUERY_RESULT_DATAS'});
        this.store$.dispatch({type: 'ADD_QUERY_RESULT_DATAS', payload: choicedDatas});
        this.isApprovedDBrDatas = true;

        if (!datas.checkFlag) {
          this.isApprovedDBrDatas = false;
        }

        // for (let i = 0; i < this.queryListResult.length; i++) {
        //   if (this.queryListResult[i]['checkResultMessage']) {
        //     this.isApprovedDBrDatas = false;
        //     break;
        //   }
        // }
        this.uploadResultDialog = false;
        this.uploadConditionDialog = false;
        if (this.isSourceFromBonusList) {
          this.isSourceFromBonusList = false;
        }
        this.singleBatchNumberDialog = false;
      });
  }

  buildMatchedDBInfo(selectedDatas: object[], uploadedDatas: object[]) {
    let data = {};
    data['flag'] = this.flag;
    data['dbrChoiceDbListBO'] = [];
    data['dbrDealerCashListBO'] = [];
    for (let i = 0; i < selectedDatas.length; i++) {
      let tempData = {};
      tempData['dbNumber'] = selectedDatas[i]['dbNumber'];
      tempData['dbItemBaseInfoId'] = selectedDatas[i]['dbItemBaseInfoId'];
      tempData['dbItemNumber'] = selectedDatas[i]['dbItemNumber'];
      tempData['itemDescription'] = selectedDatas[i]['itemDescription'];
      tempData['carSeries'] = selectedDatas[i]['carSeries'];
      tempData['financialDescription'] = selectedDatas[i]['financialDescription'];
      tempData['rewardType'] = selectedDatas[i]['rewardType'];
      tempData['isApproved'] = selectedDatas[i]['isApproved'];
      tempData['controlType'] = selectedDatas[i]['controlType'];
      tempData['amount'] = selectedDatas[i]['amount'];

      data['dbrChoiceDbListBO'].push(tempData);
    }

    for (let j = 0; j < uploadedDatas.length; j++) {
      let tempData = {};
      tempData['dealerCode'] = uploadedDatas[j]['dealerCode'];
      tempData['dealerName'] = uploadedDatas[j]['dealerName'];
      tempData['payableAmount'] = uploadedDatas[j]['payableAmount'];
      tempData['useDepartment'] = uploadedDatas[j]['useDepartment'];
      tempData['carBrand'] = uploadedDatas[j]['carBrand'];
      tempData['carSeries'] = uploadedDatas[j]['carSeries'];
      tempData['carPackage'] = uploadedDatas[j]['carPackage'];
      tempData['vin'] = uploadedDatas[j]['vin'];
      tempData['remark'] = uploadedDatas[j]['remark'];

      data['dbrDealerCashListBO'].push(tempData);
    }

    return data;
  }

  onBasicUploadAuto(data: any, status: number) {
    let resp = JSON.parse(data.xhr.response);
    let result = resp.data;

    if (resp.success) {
      if (status) {
        this.uploadResultDialog = true;
      }

      this.uploadResultDatas = result.dbrDealerCashListBO;
      this.matchResult = result.checkFlag;
      this.uploadListSource = result.listSource;
    } else {
    }
  }

  onBasicUploadBefore(data: any) {
    let pasedData = JSON.stringify(this.rebuildUploadData(this.queryListResult));
    data.formData.append('choiceDbList', pasedData);
  }

  rebuildUploadData(datas: object[]) {
    let uploadDatas = [];

    for (let i = 0; i < datas.length; i++) {
      let tempData = {};
      tempData['dbNumber'] = datas[i]['dbNumber'];
      tempData['dbItemBaseInfoId'] = datas[i]['itemId'];
      tempData['dbItemNumber'] = datas[i]['itemNumber'];
      tempData['itemDescription'] = datas[i]['itemDescr'];
      tempData['carSeries'] = datas[i]['carSeries'];
      tempData['financialDescription'] = datas[i]['financialDescription'];
      tempData['rewardType'] = datas[i]['rewardTypes'];
      tempData['isApproved'] = datas[i]['isApproved'];
      tempData['controlType'] = datas[i]['controlType'];
      tempData['amount'] = datas[i]['savingAmount'];

      uploadDatas.push(tempData);
    }

    return uploadDatas;
  }

  submitDBRDatas() {
    let checkResult = this.checkIsFinishedCommonSetting();
    if (!checkResult['status']) {
      window.alert(checkResult['message']);
      return;
    }
    let dbrInfoDatas = this.buildDBRInfoDatas(this.queryListResult, this.dbrCashList);
    this._bonusService.saveDbrInfo(dbrInfoDatas)
      .subscribe(data => {
          this.saveResultInfo = [];
          this.saveResultInfo.push({severity: 'success', summary: '', detail: '保存成功！'});
          setTimeout(function () {
            this._router.navigate(['bonus']);
          }.bind(this), 3000);
        },
        err => {
          this.saveResultInfo = [];
          let errorStatus = err.message;
          this.saveResultInfo.push({severity: 'error', summary: '', detail: '保存失败！'});
          setTimeout(function () {
            this._router.navigate(['error', errorStatus]);
          }.bind(this, errorStatus), 3000);
        });
  }

  checkIsFinishedCommonSetting() {
    let errorMessages = {
      description: '请填写DBR描述',
      bonusType: '请选择奖金类型',
      startTime: '请选择发放起始时间',
      endTime: '请选择发放结束时间',
      needToHold: false,
      location: '请选择发放地'
    };

    let checkResult = {};
    checkResult['status'] = true;
    checkResult['message'] = [];
    for (let p in this.commonSetting) {
      if (this.commonSetting[p] === '' || this.commonSetting[p] === null) {
        checkResult['status'] = false;
        checkResult['message'].push(errorMessages[p]);
        break;
      }
    }
    return checkResult;
  }

  buildDBRInfoDatas(queryList: object[], cashList: object[]) {
    let data = {};
    data['dbrNumber'] = UUID.UUID();
    data['description'] = this.commonSetting['description'];
    data['rewardType'] = this.commonSetting['bonusType'];
    data['realeseStartDate'] = this.commonSetting['startTime'].getTime();
    data['realeseEndDate'] = this.commonSetting['endTime'].getTime();
    data['isNeedHold'] = this.commonSetting['needToHold'];
    data['releaseSystem'] = this.commonSetting['location'];
    data['dbrBaseInfoState'] = '3';
    data['listSource'] = this.uploadListSource;
    data['dbrChoiceDbListBO'] = this.queryListResult;
    data['dbrDealerCashListBO'] = this.dbrCashList;

    return data;
  }

  selectNode(data: any) {
    this.selectedDBItemTreeDatas.push(data.node);
  }

  unSelectNode(data: any) {
    this.selectedDBItemTreeDatas = this.selectedDBItemTreeDatas.filter(dbItem => {
      return dbItem.label !== data.node.label;
    });
  }

}
