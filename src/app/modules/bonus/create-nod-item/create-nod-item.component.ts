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
  files: TreeNode[];
  selectedFiles: TreeNode[];
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

    this.carTree = Observable.combineLatest(carTreeData$, carTreeFilter$,
      (datas: TreeNode[], filter: any) => filter(datas));
  }

  ngOnInit() {
    this._bonusService.getData();
    this._carTreeService.getFilesystem()
      .subscribe(data => this.files = data);
  }

  createItem() {
    console.log(this.files);
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

    this.carTree.subscribe(cars => {
      this.cars = cars;
    });

    if(!_.isNil(this.selectedCars) && this.cars.length > 0){
      this.store$.dispatch({type:'CARTREE_SELECTED'});
    }

    if (this.cars.length === 0 && !this.carTreeSubscription) {
      this.store$.dispatch({type: 'GET_CARTREE', payload: this.createCarTree(this.files)});
      this.carTreeSubscription = this.carTree
        .subscribe(cars => {
          console.log(cars);
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

  nodeSelect(data:any){
    console.log(data);
    data.node.selected = true;
  }

  nodeUnSelect(data:any){
    console.log(data);
    data.node.selected = false;
  }

}
