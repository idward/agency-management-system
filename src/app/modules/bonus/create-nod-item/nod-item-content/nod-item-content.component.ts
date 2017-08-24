import {Component, EventEmitter, Input, OnInit, Output, OnChanges} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TreeNode} from "primeng/primeng";
import * as _ from 'lodash';
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {Nod} from "../../../../model/nod/nod.model";

@Component({
  selector: 'app-nod-item-content',
  templateUrl: './nod-item-content.component.html',
  styleUrls: ['./nod-item-content.component.scss']
})
export class NodItemContentComponent implements OnInit,OnChanges {
  selectedFiles: TreeNode[];
  selectedCarTreeNode: TreeNode[] = [];
  carTreeNode: TreeNode;
  isCashModule: boolean = true;
  caoche_amount: boolean = false;
  jiaoche_amount: boolean = false;
  store_amount: boolean = false;
  singleCar_forcast: boolean = false;
  financial: boolean = false;
  extended_insurance: boolean = false;
  replacement: boolean = false;
  insurance: boolean = false;
  maintenance: boolean = false;
  keyword: string;
  @Input() selectedCars: TreeNode[] = [];
  @Input() display: boolean;
  @Input() files: TreeNode[];
  @Input() carTree: Observable<TreeNode[]>;
  @Input() selectedServiceType: string;
  @Input() commonSetting: any;
  @Output() commonSettingEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() nodItemCheckedEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() editCarCategoryEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideDialogEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() totalAmountChangeEvt:EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(){
    if(this.files.length > 0 && this.selectedServiceType === 'PROMOTIONAL_AMOUNT'){
      this.totalAmountChangeEvt.emit(this.files);
    }
  }

  onChangeValue(data: any,type:string): any {
    let result;
    if(type === 'RATIO'){
      result = Number(data).toFixed(2);
    } else if(type === 'AMOUNT') {
      result = this.formatCurrency(data);
    }
    return result;
  }

  formatCurrency(num) {
    let nums = num.toString().replace(/\$|\,/g, '');
    if (isNaN(nums)){
      nums = "0";
    }
    let sign:boolean = (nums == (nums = Math.abs(nums)));
    nums = Math.floor(nums * 100 + 0.50000000001);
    let cents:any = nums % 100;
    nums = Math.floor(nums / 100).toString();
    if (cents < 10){
      cents = "0" + cents;
    }
    for (let i = 0; i < Math.floor((nums.length - (1 + i)) / 3); i++) {
      nums = nums.substring(0, nums.length - (4 * i + 3)) + ',' +
        nums.substring(nums.length - (4 * i + 3));
    }
    return (((sign) ? '' : '-') + nums + '.' + cents);
  }

  commonSettingData(data: any) {
    this.commonSettingEvt.emit(this.commonSetting);
  }

  toggleCash() {
    this.isCashModule = true;
  }

  toggleNonCash() {
    this.isCashModule = false;
  }

  nodeItemChecked(checked: boolean, data: TreeNode, fieldname: string) {
    let nodItemData = {checked, data, fieldname};
    this.nodItemCheckedEvt.emit(nodItemData);
  }

  editCarCategory(event: Event) {
    this.editCarCategoryEvt.emit(event);
  }

  onHide() {
    this.keyword = '';
    this.selectedCars = [..._.uniq(this.selectedCars), ...this.selectedCarTreeNode];
    this.hideDialogEvt.emit(this.selectedCars);
  }

  nodeSelect(data: any) {
    this.carTreeNode = this.setChildNodeChecked(data.node, true);
    this.selectedCarTreeNode = [...this.selectedCarTreeNode, ...this.chooseTreeNode(this.carTreeNode)];
    console.log('selectedCarTreeNode', this.selectedCarTreeNode);
  }

  private chooseTreeNode(carTreeNode: TreeNode): TreeNode[] {
    let tempData = [];
    let subTempData = [];
    if (carTreeNode.children) {
      tempData = _.flattenDepth(carTreeNode.children, 1);
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].children) {
          let data = _.flattenDepth(tempData[i].children, 1);
          subTempData = [...subTempData, tempData[i], ...data];
        } else {
          subTempData = [...subTempData, tempData[i]];
        }
      }
    }
    return [carTreeNode, ...subTempData];
  }

  nodeUnSelect(data: any) {
    this.carTreeNode = this.setParentNodeChecked(data.node, false);
    this.carTreeNode = this.setChildNodeChecked(data.node, false);
    this.selectedCarTreeNode = this.filterTreeNode(this.carTreeNode);
    console.log('selectedCarTreeNode', this.selectedCarTreeNode);
  }

  private filterTreeNode(carTreeNode: TreeNode): TreeNode[] {
    let unSelectedTreeNode = this.chooseTreeNode(carTreeNode);
    return this.selectedCarTreeNode.filter(data => {
      return _.findIndex(unSelectedTreeNode, function (o) {
          return o.label === data.label;
        }) === -1;
    });
  }

  setChildNodeChecked(node: TreeNode, checkStatus: boolean): TreeNode {
    console.log('node:', node);

    node.selected = checkStatus;
    if (node.children && node.children.length > 0) {
      node.children = node.children.map(sNode => {
        sNode.selected = checkStatus;
        if (sNode.children && sNode.children.length > 0) {
          sNode.children = sNode.children.map(ssNode => {
            ssNode.selected = checkStatus;
            return ssNode;
          })
        }
        return sNode;
      })
    }
    return node;
  }

  setParentNodeChecked(node: TreeNode, checkStatus: boolean): TreeNode {
    console.log('node:', node);

    node.selected = checkStatus;
    if (node.parent) {
      node.parent.selected = checkStatus;
    }
    if (node.parent.parent) {
      node.parent.parent.selected = checkStatus;
    }
    return node;
  }

}
