import {Component, Inject, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {ConfirmationService, TreeNode} from 'primeng/primeng';
import * as _ from 'lodash';

import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import 'rxjs/Rx';

import {OptionItem} from "../../../../model/optionItem/optionItem.model";
import {SERVICETYPES} from "../../../../data/optionItem/optionItem.data";
import {Nod} from "../../../../model/nod/nod.model";
import {NodItem} from "../../../../model/nod/nodItem.model";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {
  nodItemCount: number = 0;
  nodItemOptions: OptionItem[] = [];
  selectedNodItem: string;
  files: Observable<TreeNode[]>;
  selectedFiles: TreeNode[];
  tempCarsData: TreeNode[] = [];
  display: boolean = false;
  cars: TreeNode[] = [];
  carTree: Observable<TreeNode[]>;
  selectedCars: TreeNode[];
  serviceTypes: OptionItem[];
  serviceType: string;
  selectedServiceType: string;
  nod: Nod;
  nodItem: Observable<NodItem []>;
  isShowServiceType: boolean = false;
  nodItemSubscription: Subscription;
  carTreeSubscription: Subscription;
  currentNodItem: NodItem;
  parsedData: Object = {};

  constructor(@Inject('BonusService') private _bonusService,
              @Inject('CarTreeService') private _carTreeService,
              @Inject(ConfirmationService) private _confirmService,
              private store$: Store<any>, private _router: Router,
              private _route: ActivatedRoute) {
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
        } else {
          return;
        }
      });

    this.carTree = Observable.combineLatest(nodItemData$, carTreeFilter$,
      (datas: TreeNode[], filter: any) => {
        if (!_.isNil(this.currentNodItem)) {
          return filter(this.currentNodItem.nodItem_data['cartree_model']);
        }
      });
  }

  ngOnInit() {
    this._bonusService.getData().subscribe(data => this.parsedData = data);

    this.serviceTypes = SERVICETYPES;
    this._route.params.subscribe(data => {
      this.nod = new Nod(data.nodId);
    });

    if (!this.nodItemSubscription) {
      this.nodItemSubscription = this.nodItem.subscribe(nodItems => {
        console.log('total:', nodItems);
        this.nod.desc = this.parsedData['description'];
        this.nod.department = this.parsedData['department'];
        this.nod.createdType = this.parsedData['createdType'];
        this.nod.nodYear = this.parsedData['year'];
        this.nod.nodList = nodItems;
        console.log('nod:', this.nod);
        if (!_.isNil(nodItems) && nodItems.length > 0) {
          this.currentNodItem = nodItems.filter(data => data.nodItem_id === this.selectedNodItem)[0];
        } else {
          this.currentNodItem = null;
        }
        console.log('currentNodItem:', this.currentNodItem);
        this.nodItemCount = nodItems.length;
        if (!_.isNil(this.currentNodItem)) {
          this.cars = this.currentNodItem.nodItem_data['cartree_model'];
        } else {
          this.cars = [];
        }
        console.log('cars:', this.cars);
      });
    }
  }

  chooseServiceType() {
    this.isShowServiceType = true;
  }

  chooseNodItem(data: any) {
    this.selectedNodItem = data;
    let currentNodItem = this.nod.nodList.filter(data => data.nodItem_id === this.selectedNodItem)[0];
    this.serviceType = currentNodItem.nodItem_type;
    this.currentNodItem = currentNodItem;
    this.selectedCars = this.currentNodItem.nodItem_data['saved_cartree_model'];
    if (this.selectedCars.length > 0) {
      this.store$.dispatch({type: 'CAR_SELECTED', payload: this.selectedCars});
    }

    this.cars = this.currentNodItem.nodItem_data['cartree_model'];

    console.log('currentNodItem:', this.currentNodItem);
  }

  createItem() {
    let nodItemData = [];
    this.isShowServiceType = false;
    let nodItem = this._bonusService.createNODItem(this.selectedServiceType);
    nodItemData.push(nodItem);
    this.serviceType = nodItem.nodItem_type;

    this.nodItemOptions.push(new OptionItem('Item-' + nodItem.nodItem_id, nodItem.nodItem_id));
    this.selectedNodItem = nodItem.nodItem_id;

    this.store$.dispatch({type: 'CREATE_NODITEM', payload: nodItemData});
    this.selectedServiceType = undefined;
    this.selectedCars = undefined;
    console.log('AAA:', this.selectedCars);
  }

  getCommonData(data: any) {
    console.log(data);
    console.log('Data', this.currentNodItem);

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
      message: '您确认删除Item-' + this.selectedNodItem + '吗?',
      header: '删除确认框',
      icon: 'fa fa-trash',
      accept: () => {
        this.store$.dispatch({type: 'DELETE_NODITEM', payload: this.selectedNodItem});
        this.nodItemOptions = this.nodItemOptions.filter(data => data.value !== this.selectedNodItem);
        if (this.nodItemOptions && this.nodItemOptions.length > 0) {
          this.chooseNodItem(this.nodItemOptions[0].value);
        }
      },
      reject: () => {
        console.log('no');
      }
    })
  }

  saveDraft() {
    console.log('draft:', this.nod);
    this._bonusService.saveNodInfo(this.nod)
      .subscribe(data => console.log(data));
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
      this._carTreeService.getFilesystem()
        .subscribe(datas => {
          if (this.currentNodItem.nodItem_type === 'PROMOTIONAL_RATIO') {
            this.currentNodItem.nodItem_data['promotional_ratio'] = datas;
          } else if (this.currentNodItem.nodItem_type === 'PROMOTIONAL_AMOUNT') {
            this.currentNodItem.nodItem_data['promotional_amount'] = datas;
          }
          this.currentNodItem.nodItem_data['cartree_model'] = this.createCarTree(datas);
          this.store$.dispatch({type: 'UPDATE_NODEITEM', payload: this.currentNodItem});
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
    console.log('selectedCars:', this.selectedCars);
    this.store$.dispatch({type: 'CAR_SELECTED', payload: this.selectedCars});
    this.currentNodItem.nodItem_data['saved_cartree_model'] = this.selectedCars;
    this.files.subscribe(promotionDatas => {
      if (this.serviceType === 'PROMOTIONAL_RATIO') {
        this.currentNodItem.nodItem_data['saved_promotional_ratio'] = promotionDatas;
      } else if (this.serviceType === 'PROMOTIONAL_AMOUNT') {
        // promotionDatas[0]['total_amount_count'] = 0;
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
