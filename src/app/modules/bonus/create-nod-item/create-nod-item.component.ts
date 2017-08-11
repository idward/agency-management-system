import {Component, Inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {TreeNode} from 'primeng/primeng';
import * as _ from 'lodash';
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import 'rxjs/Rx';

@Component({
  selector: 'app-create-nod-item',
  templateUrl: './create-nod-item.component.html',
  styleUrls: ['./create-nod-item.component.scss']
})
export class CreateNodItemComponent implements OnInit {
  startTime: Date;
  endTime: Date;
  releaseTime: Date;
  isFastProcess: boolean;
  isApproval: boolean;
  files: Observable<TreeNode[]>;
  selectedFiles: TreeNode[];
  tempCarsData: TreeNode[] = [];
  caoche_amount: boolean = false;
  jiaoche_amount: boolean = false;
  store_amount: boolean = false;
  display: boolean = false;
  cars: TreeNode[] = [];
  carTree: Observable<TreeNode[]>;
  carTreeSubscription: Subscription;
  selectedCars: TreeNode[];
  keyword: string = '';

  constructor(@Inject('BonusService') private _bonusService,
              @Inject('CarTreeService') private _carTreeService,
              private store$: Store<TreeNode[]>) {
    const carTreeData$ = this.store$.select('carTree').startWith([]);
    const carTreeFilter$ = this.store$.select('carTreeFilter');
    const carDatas$ = this.store$.select('carDatas');
    const carDatasFilter$ = this.store$.select('carDatasFilter');

    this.files = Observable.zip(carDatas$, carDatasFilter$,
      (datas: TreeNode[], filter: any) => filter(datas));

    this.carTree = Observable.combineLatest(carTreeData$, carTreeFilter$,
      (datas: TreeNode[], filter: any) => filter(datas));
  }

  ngOnInit() {
    this._bonusService.getData();
  }

  createItem() {
  }

  saveDraft() {

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

    if (this.tempCarsData.length > 0) {
      this.store$.dispatch({type: 'GET_CARS', payload: []});
    }

    this.carTree.subscribe(cars => {
      this.cars = cars;
      //console.log('cars:',this.cars);
    });

    if (!_.isNil(this.selectedCars) && this.selectedCars.length > 0 && this.cars.length > 0) {
      this.store$.dispatch({type: 'CARTREE_SELECTED'});
    } else if (_.isNil(this.selectedCars) && this.cars.length > 0) {
      this.store$.dispatch({type: 'SEARCH_KEYWORDS', payload: ''});
    } else if(!_.isNil(this.selectedCars) && this.selectedCars.length === 0 && this.cars.length === 0){
      this.store$.dispatch({type: 'SEARCH_KEYWORDS', payload: ''});
    } else if(!_.isNil(this.selectedCars) && this.selectedCars.length === 0 && this.cars.length > 0){
      this.store$.dispatch({type: 'SEARCH_KEYWORDS', payload: ''});
    }

    if (this.cars.length === 0 && !this.carTreeSubscription) {
      this._carTreeService.getFilesystem()
        .subscribe(datas => {
          this.tempCarsData = datas;
          this.store$.dispatch({type: 'GET_CARS', payload: datas});
          this.store$.dispatch({type: 'GET_CARTREE', payload: this.createCarTree(datas)});
        });

      this.carTreeSubscription = this.carTree
        .subscribe(cars => {
          //console.log('carTree', cars);
        });
    }

    Observable.fromEvent(document.body.querySelector('#searchkey'), 'keyup')
      .map(event => event['target'].value)
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(keyword => this.store$.dispatch({type: 'SEARCH_KEYWORDS', payload: keyword}));
  }

  onHide() {
    this.display = false;
    this.keyword = '';
    // console.log(this.tempCarsData);
    if(this.selectedCars && this.selectedCars.length > 0){
      this.selectedCars = this.selectedCars.filter(data => data['selected'] === true);
    }
    console.log('selectedCars:', this.selectedCars);
    this.store$.dispatch({type: 'CAR_SELECTED', payload: this.selectedCars});
  }

  toggleCash() {

  }

  toggleNonCash() {

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

  nodeSelect(data: any) {
    data.node.selected = true;
  }

  nodeUnSelect(data: any) {
    data.node.selected = false;
    data.node.parent.selected = false;
    this.selectedCars = this.setUnselectedCar(this.selectedCars, data.node.parent);
  }

  setUnselectedCar(selectedCars: any, unselectedParent: any): any {
    for (var i = 0; i < selectedCars.length; i++) {
      if (selectedCars[i].label === unselectedParent.label) {
        selectedCars[i].partialSelected = unselectedParent.partialSelected;
        selectedCars[i].selected = unselectedParent.selected;
      }
    }
    return selectedCars;
  }

  nodeItemChecked(checked: boolean, data: TreeNode, fieldname: string) {
    console.log(data);

    this.store$.dispatch({
      type: 'TOGGLE_COMBINATION',
      payload: {field: fieldname, node: data, status: checked}
    });

    this.files.subscribe(data => console.log('Files:', data));
  }

}
