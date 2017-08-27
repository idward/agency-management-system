///<reference path="../../../../../../node_modules/@angular/core/src/metadata/lifecycle_hooks.d.ts"/>
import {
  Component, EventEmitter, Input, OnInit, Output, OnChanges, OnDestroy, DoCheck,
  AfterContentChecked, AfterViewChecked
} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TreeNode} from "primeng/primeng";
import * as _ from 'lodash';
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {Nod} from "../../../../model/nod/nod.model";
import {NodItem} from "../../../../model/nod/nodItem.model";

@Component({
  selector: 'app-nod-item-content',
  templateUrl: './nod-item-content.component.html',
  styleUrls: ['./nod-item-content.component.scss']
})
export class NodItemContentComponent implements OnInit,OnChanges,OnDestroy {
  selectedFiles:TreeNode[];
  selectedCarTreeNode:TreeNode[] = [];
  carTreeNode:TreeNode;
  isCashModule:boolean = true;
  caoche_amount:boolean = false;
  jiaoche_amount:boolean = false;
  store_amount:boolean = false;
  singleCar_forcast:boolean = false;
  financial:boolean = false;
  extended_insurance:boolean = false;
  replacement:boolean = false;
  insurance:boolean = false;
  maintenance:boolean = false;
  keyword:string;
  @Input() currentNodItem:NodItem;
  @Input() selectedCars:TreeNode[] = [];
  @Input() display:boolean;
  @Input() files:TreeNode[];
  @Input() carTree:Observable<TreeNode[]>;
  @Input() selectedServiceType:string;
  @Input() commonSetting:any;
  @Output() commonSettingEvt:EventEmitter<any> = new EventEmitter<any>();
  @Output() nodItemCheckedEvt:EventEmitter<any> = new EventEmitter<any>();
  @Output() editCarCategoryEvt:EventEmitter<any> = new EventEmitter<any>();
  @Output() hideDialogEvt:EventEmitter<any> = new EventEmitter<any>();
  @Output() totalAmountChangeEvt:EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.files.length > 0 && this.selectedServiceType === 'PROMOTIONAL_AMOUNT') {
      let currentNodItem = this.updateTotalAmount(this.files);
      this.totalAmountChangeEvt.emit(currentNodItem);
    }
  }

  ngOnDestroy() {
    if (this.files.length > 0 && this.selectedServiceType === 'PROMOTIONAL_AMOUNT') {
      let currentNodItem = this.updateTotalAmount(this.files);
      this.totalAmountChangeEvt.emit(currentNodItem);
    }
  }

  updateTotalAmount(data:any):NodItem {
    this.currentNodItem.nodItem_data['promotional_amount'] =
      this.currentNodItem.nodItem_data['promotional_amount'].map(od => {
        od.cash_total_amount = data[0].cash_total_amount;
        od.nocash_total_amount = data[0].nocash_total_amount;
        od.financial_total_amount = data[0].financial_total_amount;
        od.financial_total_amount_check = data[0].financial_total_amount_check;
        od.replacement_total_amount = data[0].replacement_total_amount;
        od.replacement_total_amount_check = data[0].replacement_total_amount_check;
        od.insurance_total_amount = data[0].insurance_total_amount;
        od.insurance_total_amount_check = data[0].insurance_total_amount_check;
        return od;
      });
    this.currentNodItem.nodItem_data['saved_promotional_amount'] = this.currentNodItem.nodItem_data['saved_promotional_amount'].map(od => {
      od.cash_total_amount = data[0].cash_total_amount;
      od.nocash_total_amount = data[0].nocash_total_amount;
      od.financial_total_amount = data[0].financial_total_amount;
      od.financial_total_amount_check = data[0].financial_total_amount_check;
      od.replacement_total_amount = data[0].replacement_total_amount;
      od.replacement_total_amount_check = data[0].replacement_total_amount_check;
      od.insurance_total_amount = data[0].insurance_total_amount;
      od.insurance_total_amount_check = data[0].insurance_total_amount_check;
      return od;
    });
    return this.currentNodItem;
  }

  changeValueByMSRP(node:any) {
    for (let p in node.data) {
      let basic = p.slice(0, p.indexOf('_'));
      node.data[basic + '_jine'] = this.formatCurrency(node.data['msrp'] * node.data[basic + '_bili']);
    }
  }

  onChangeValue(node:any, nodeName:string, type:string):any {
    console.log('node:', node);
    let result;
    if (type === 'RATIO') {
      result = Number(node.data[nodeName]).toFixed(2);
      let jine = nodeName.slice(0, nodeName.indexOf('_')) + '_jine';
      node.data[jine] = this.formatCurrency(node.data['msrp'] * node.data[nodeName]);
      if (node.data.level === 1) {
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            node.children[i].data[nodeName] = result;
            node.children[i].data[jine] = this.formatCurrency(node.children[i].data['msrp'] * node.children[i].data[nodeName]);
          }
        }
      }
    } else if (type === 'AMOUNT') {
      if(this.selectedServiceType === 'PROMOTIONAL_AMOUNT'){
        result = this.formatCurrency(node[nodeName]);
      } else {
        result = this.formatCurrency(node.data[nodeName]);
        if (node.data.level === 1) {
          if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
              node.children[i].data[nodeName] = this.formatCurrency(node.data[nodeName]);
            }
          }
        }
      }
    }
    return result;
  }

  formatCurrency(num) {
    let nums = num.toString().replace(/\$|\,/g, '');
    if (isNaN(nums)) {
      nums = "0";
    }
    let sign:boolean = (nums == (nums = Math.abs(nums)));
    nums = Math.floor(nums * 100 + 0.50000000001);
    let cents:any = nums % 100;
    nums = Math.floor(nums / 100).toString();
    if (cents < 10) {
      cents = "0" + cents;
    }
    for (let i = 0; i < Math.floor((nums.length - (1 + i)) / 3); i++) {
      nums = nums.substring(0, nums.length - (4 * i + 3)) + ',' +
        nums.substring(nums.length - (4 * i + 3));
    }
    return (((sign) ? '' : '-') + nums + '.' + cents);
  }

  commonSettingData(data:any) {
    this.commonSettingEvt.emit(this.commonSetting);
  }

  toggleCash() {
    this.isCashModule = true;
  }

  toggleNonCash() {
    this.isCashModule = false;
  }

  nodeItemChecked(checked:boolean, data:TreeNode, fieldname:string) {
    let nodItemData = {checked, data, fieldname};
    this.nodItemCheckedEvt.emit(nodItemData);
  }

  editCarCategory(event:Event) {
    this.editCarCategoryEvt.emit(event);
  }

  onHide() {
    this.keyword = '';
    this.selectedCars = [..._.uniq(this.selectedCars), ...this.selectedCarTreeNode];
    this.hideDialogEvt.emit(this.selectedCars);
  }

  nodeSelect(data:any) {
    this.carTreeNode = this.setChildNodeChecked(data.node, true);
    this.selectedCarTreeNode = [...this.selectedCarTreeNode, ...this.chooseTreeNode(this.carTreeNode)];
    console.log('selectedCarTreeNode', this.selectedCarTreeNode);
  }

  private chooseTreeNode(carTreeNode:TreeNode):TreeNode[] {
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

  nodeUnSelect(data:any) {
    this.carTreeNode = this.setParentNodeChecked(data.node, false);
    this.carTreeNode = this.setChildNodeChecked(data.node, false);
    this.selectedCarTreeNode = this.filterTreeNode(this.carTreeNode);
    console.log('selectedCarTreeNode', this.selectedCarTreeNode);
  }

  private filterTreeNode(carTreeNode:TreeNode):TreeNode[] {
    let unSelectedTreeNode = this.chooseTreeNode(carTreeNode);
    return this.selectedCarTreeNode.filter(data => {
      return _.findIndex(unSelectedTreeNode, function (o) {
          return o.label === data.label;
        }) === -1;
    });
  }

  setChildNodeChecked(node:TreeNode, checkStatus:boolean):TreeNode {
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

  setParentNodeChecked(node:TreeNode, checkStatus:boolean):TreeNode {
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
