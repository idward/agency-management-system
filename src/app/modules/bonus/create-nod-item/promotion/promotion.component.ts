import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import 'rxjs/Rx';
import * as _ from 'lodash';

import {ConfirmationService, Message, TreeNode} from 'primeng/primeng';
import {OptionItem} from "../../../../model/optionItem/optionItem.model";
import {ControlTypes, SERVICETYPES} from "../../../../data/optionItem/optionItem.data";
import {Nod, SelectedNodItem} from "../../../../model/nod/nod.model";
import {NodItem} from "../../../../model/nod/nodItem.model";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class NodPromotionComponent implements OnInit, OnDestroy {
  nodItemCount: number = 0;
  nodItemOptions: OptionItem[] = [];
  controlTypeOptions: OptionItem[] = [];
  selectedNodItem: SelectedNodItem;
  createdItemName: string;
  showLoading: boolean;
  files: Observable<TreeNode[]>;
  selectedFiles: TreeNode[];
  display: boolean = false;
  cars: TreeNode[] = [];
  carTree: Observable<TreeNode[]>;
  selectedCars: TreeNode[];
  serviceTypes: OptionItem[];
  serviceType: string;
  selectedServiceType: string;
  fastProcessDialog: boolean;
  nod: Nod;
  nodItem: Observable<NodItem []>;
  isShowServiceType: boolean = false;
  nodItemSubscription: Subscription;
  carTreeSubscription: Subscription;
  filesSubscription: Subscription;
  currentNodItem: NodItem;
  parsedData: Object = {};
  saveResultInfo: Message[];
  createdItemForm: FormGroup;

  constructor(@Inject('BonusService') private _bonusService,
              @Inject('CarTreeService') private _carTreeService,
              @Inject(ConfirmationService) private _confirmService,
              private store$: Store<any>, private _router: Router,
              private _route: ActivatedRoute, private _form: FormBuilder) {
    const carTreeFilter$ = this.store$.select('carTreeFilter');
    const carDatasFilter$ = this.store$.select('carDatasFilter');
    const nodItemData$ = this.store$.select('nodItemDatas');
    const nodItemDataFilter$ = this.store$.select('nodItemDataFilter');

    this.nodItem = Observable.combineLatest(nodItemData$, nodItemDataFilter$,
      (datas: NodItem[], filter: any) => datas.filter(filter));

    this.files = Observable.zip(nodItemData$, carDatasFilter$,
      (datas: TreeNode[], filter: any) => {
        if (this.currentNodItem.nodItem_type === 'PROMOTIONAL_RATIO') {
          return filter(this.currentNodItem.nodItem_data['promotional_ratio']);
        } else if (this.currentNodItem.nodItem_type === 'PROMOTIONAL_AMOUNT') {
          return filter(this.currentNodItem.nodItem_data['promotional_amount']);
        }
      });

    this.carTree = Observable.combineLatest(nodItemData$, carTreeFilter$,
      (datas: TreeNode[], filter: any) => {
        if (!_.isNil(this.currentNodItem)) {
          return filter(this.currentNodItem.nodItem_data['cartree_model']);
        }
      });

    this.createdItemForm = this._form.group({
      createdItemName: ['', Validators.required],
      selectedServiceType: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.controlTypeOptions = ControlTypes;
    this._bonusService.getData().subscribe(data => this.parsedData = data);

    this.serviceTypes = SERVICETYPES;
    this._route.params.subscribe(data => {
      this.nod = new Nod(data.nodId);
    });

    if (!this.nodItemSubscription) {
      this.nodItemSubscription = this.nodItem.subscribe(nodItems => {
        this.nod.desc = this.parsedData['description'];
        this.nod.department = this.parsedData['department'];
        this.nod.createdType = this.parsedData['createdType'];
        this.nod.nodYear = this.parsedData['year'];
        this.nod.nodList = nodItems;
        if (!_.isNil(nodItems) && nodItems.length > 0) {
          this.currentNodItem = nodItems.filter(data => data.nodItem_id === this.selectedNodItem.itemValue)[0];
        }
        this.nodItemCount = nodItems.length;
        if (!_.isNil(this.currentNodItem)) {
          this.cars = this.currentNodItem.nodItem_data['cartree_model'];
        } else {
          this.cars = [];
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.store$.dispatch({type: 'EMPTY_ALL_NODITEMS'});
    if (this.nodItemSubscription) {
      this.nodItemSubscription.unsubscribe();
    }
    if (this.filesSubscription) {
      this.filesSubscription.unsubscribe();
    }
    if (this.carTreeSubscription) {
      this.carTreeSubscription.unsubscribe();
    }
  }

  chooseServiceType() {
    this.isShowServiceType = true;
  }

  chooseNodItem(data: any) {
    this.selectedNodItem.itemValue = data;
    let currentNodItem = this.nod.nodList.filter(data => data.nodItem_id === this.selectedNodItem.itemValue)[0];
    this.serviceType = currentNodItem.nodItem_type;
    this.currentNodItem = currentNodItem;
    this.selectedCars = this.currentNodItem.nodItem_data['saved_cartree_model'];
    if (this.selectedCars.length > 0) {
      this.store$.dispatch({type: 'CAR_SELECTED', payload: this.selectedCars});
    }

    this.cars = this.currentNodItem.nodItem_data['cartree_model'];
  }

  createItem(formValue: any) {
    let itemName = formValue.createdItemName;
    let nodItemData = [];
    this.isShowServiceType = false;
    let nodItem = this._bonusService.createNODItem(this.selectedServiceType);
    nodItem = this.setInitialSettingCondition(nodItem);
    nodItemData.push(nodItem);
    this.serviceType = nodItem.nodItem_type;

    this.nodItemOptions.push(new OptionItem('Item-' + itemName, nodItem.nodItem_id));
    this.selectedNodItem = {itemName: itemName, itemValue: nodItem.nodItem_id};

    this.store$.dispatch({type: 'CREATE_NODITEM', payload: nodItemData});
    this.selectedServiceType = undefined;
    this.selectedCars = undefined;
    this.createdItemForm.reset();
  }

  setInitialSettingCondition(nodItem: any) {
    let currentNodItem = nodItem;

    let initialSettingCondition = {
      'description': '',
      'startTime': null,
      'endTime': null,
      'releaseTime': null,
      'isApproval': false
    };

    if (nodItem['nodItem_type'] === 'PROMOTIONAL_AMOUNT') {
      initialSettingCondition = Object.assign({}, initialSettingCondition, {'controlType': 0});
    } else {
      initialSettingCondition = Object.assign({}, initialSettingCondition,
        {
          'fastProcess': {
            'rapidProcessType': '',
            'period': '',
            'releaseSystem': '',
            'isNeedHold': false
          }
        });
    }

    currentNodItem.nodItem_data.setting_condition = initialSettingCondition;

    return currentNodItem;
  }

  getCommonData(data: any) {
    let oldData = this.currentNodItem.nodItem_data['setting_condition'];
    let newData = data;
    let newSettingCondition = Object.assign({}, oldData, newData);
    this.currentNodItem.nodItem_data['setting_condition'] = newSettingCondition;
    this.store$.dispatch({type: 'UPDATE_NODEITEM', payload: this.currentNodItem});
  }

  updateTotalAmount(data: any) {
    this.store$.dispatch({type: 'UPDATE_NODEITEM', payload: data});
  }

  deleteItem() {
    this._confirmService.confirm({
      message: '您确认删除Item-' + this.selectedNodItem.itemName + '吗?',
      header: '删除确认框',
      icon: 'fa fa-trash',
      accept: () => {
        this.store$.dispatch({type: 'DELETE_NODITEM', payload: this.selectedNodItem.itemValue});
        this.nodItemOptions = this.nodItemOptions.filter(data => data.value !== this.selectedNodItem.itemValue);
        if (this.nodItemOptions && this.nodItemOptions.length > 0) {
          this.chooseNodItem(this.nodItemOptions[0].value);
        }
      },
      reject: () => {
      }
    })
  }

  saveData(data: any) {
    if (this.currentNodItem.nodItem_data['promotional_ratio']) {
      if (this.currentNodItem.nodItem_data['promotional_ratio'].length === 0) {
        window.alert('请选择车系车型');
        return;
      }
    } else if (this.currentNodItem.nodItem_data['promotional_amount']) {
      if (this.currentNodItem.nodItem_data['promotional_amount'].length === 0) {
        window.alert('请选择车系车型');
        return;
      }
    }

    if (this.currentNodItem.nodItem_data['setting_condition']) {
      let settingCondition = this.currentNodItem.nodItem_data['setting_condition'];
      let checkResult = this.checkIsFinishedCommonSetting(settingCondition);

      if (!checkResult['status']) {
        window.alert(checkResult['message']);
        return;
      } else {
        let startTime = settingCondition['startTime'].getTime();
        let endTime = settingCondition['endTime'].getTime();

        if (endTime < startTime) {
          window.alert('结束时间不能小于开始时间');
          return;
        }
      }
    }

    let type: number = data.type;
    this._bonusService.saveNodInfo(this.nod, type)
      .subscribe(data => {
          this.saveResultInfo = [];
          if (type === 1) {
            this.saveResultInfo.push({severity: 'success', summary: '', detail: '保存草稿成功！'});
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

  checkIsFinishedCommonSetting(commonSetting: object) {
    let errorMessages = {
      description: '请填写NOD描述',
      startTime: '请选择开始时间',
      endTime: '请选择结束时间',
      releaseTime: '请选择发放截止时间',
    };

    let initialCommonSetting = {
      description: '',
      startTime: null,
      endTime: null,
      releaseTime: null
    }

    let cs = Object.assign({}, initialCommonSetting, commonSetting);

    let checkResult = {};
    checkResult['status'] = true;
    checkResult['message'] = [];
    for (let p in cs) {
      if (cs[p] === '' || cs[p] === null) {
        checkResult['status'] = false;
        checkResult['message'].push(errorMessages[p]);
        break;
      }
    }
    return checkResult;
  }

  previewAllItems() {
  }

  sendItemsData() {
  }

  editCarCategory(evt: Event) {
    if (evt['screenX'] === 0 && evt['screenY'] === 0) {
      return false;
    }

    this.display = true;

    if (!_.isNil(this.selectedCars) && this.selectedCars.length > 0 && this.cars.length > 0) {
      this.store$.dispatch({type: 'CARTREE_SELECTED'});
    } else if (_.isNil(this.selectedCars) && this.cars.length > 0) {
      this.store$.dispatch({type: 'SEARCH_KEYWORDS', payload: ''});
    } else if (!_.isNil(this.selectedCars) && this.selectedCars.length === 0 && this.cars.length === 0) {
      this.store$.dispatch({type: 'SEARCH_KEYWORDS', payload: ''});
    } else if (!_.isNil(this.selectedCars) && this.selectedCars.length === 0 && this.cars.length > 0) {
      this.store$.dispatch({type: 'SEARCH_KEYWORDS', payload: ''});
    }

    if (this.cars.length === 0) {
      this.showLoading = true;
      this.carTreeSubscription = this._carTreeService.getFilesystem()
        .subscribe(datas => {
          if (this.currentNodItem.nodItem_type === 'PROMOTIONAL_RATIO') {
            this.currentNodItem.nodItem_data['promotional_ratio'] = datas;
          } else if (this.currentNodItem.nodItem_type === 'PROMOTIONAL_AMOUNT') {
            this.currentNodItem.nodItem_data['promotional_amount'] = datas;
          }
          this.currentNodItem.nodItem_data['cartree_model'] = this.createCarTree(datas);
          this.store$.dispatch({type: 'UPDATE_NODEITEM', payload: this.currentNodItem});
          this.showLoading = false;
        });
    }

    Observable.fromEvent(document.body.querySelector('.searchkey'), 'keyup')
      .map(event => event['target'].value)
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(keyword => this.store$.dispatch({type: 'SEARCH_KEYWORDS', payload: keyword}));
  }

  onHide(data: any) {
    this.display = false;
    this.selectedCars = data;

    if (this.selectedCars && this.selectedCars.length > 0) {
      let selectedCars = this.selectedCars.filter(data => data['selected'] === true);
      this.selectedCars = _.uniq(selectedCars);
    }
    this.store$.dispatch({type: 'CAR_SELECTED', payload: this.selectedCars});
    this.currentNodItem.nodItem_data['saved_cartree_model'] = this.selectedCars;
    this.filesSubscription = this.files.subscribe(promotionDatas => {
      if (this.serviceType === 'PROMOTIONAL_RATIO') {
        this.currentNodItem.nodItem_data['saved_promotional_ratio'] = promotionDatas;
      } else if (this.serviceType === 'PROMOTIONAL_AMOUNT') {
        this.currentNodItem.nodItem_data['saved_promotional_amount'] = promotionDatas;
      }
    });

    this.store$.dispatch({type: 'UPDATE_NODEITEM', payload: this.currentNodItem});
  }

  private createCarTree(data: TreeNode[]): TreeNode[] {
    var tempData = [];
    for (let i = 0; i < data.length; i++) {
      let car = this._createCarTree(data[i]);
      tempData.push(car);
    }
    return tempData;
  }

  private _createCarTree(data: TreeNode): TreeNode {
    let newData = {};
    if (data.children) {
      if (data.children.length > 0) {
        newData['children'] = this.createCarTree(data.children);
      }
    }
    newData['label'] = data.data.name;
    newData['data'] = '';
    newData['selected'] = false;
    newData['expanded'] = true;

    return newData;
  }

  private _errorHandle(err: any): Observable<any> {
    console.log('An error occured:' + err);
    return Observable.throw(err.message || err);
  }
}
