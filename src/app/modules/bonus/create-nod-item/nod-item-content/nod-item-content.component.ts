import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TreeNode} from "primeng/primeng";
import * as _ from 'lodash';

@Component({
  selector: 'app-nod-item-content',
  templateUrl: './nod-item-content.component.html',
  styleUrls: ['./nod-item-content.component.scss']
})
export class NodItemContentComponent implements OnInit {
  selectedFiles: TreeNode[];
  selectedCars: TreeNode[];
  selectedCarTreeNode: TreeNode[] = [];
  carTreeNode: TreeNode;
  isCashModule: boolean = true;
  caoche_amount: boolean = false;
  jiaoche_amount: boolean = false;
  store_amount: boolean = false;
  keyword: string;
  @Input() display: boolean;
  @Input() files: Observable<TreeNode[]>;
  @Input() carTree: Observable<TreeNode[]>;
  @Input() selectedServiceType: string;
  @Input() commonSetting: any;
  @Output() commonSettingEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() nodItemCheckedEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() editCarCategoryEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideDialogEvt: EventEmitter<TreeNode[]> = new EventEmitter<TreeNode[]>();

  constructor() {
  }

  ngOnInit() {
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
    this.selectedCars = this.selectedCarTreeNode;
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
