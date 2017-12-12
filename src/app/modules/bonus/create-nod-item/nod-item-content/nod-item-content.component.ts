import {Component, EventEmitter, Input, Output, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TreeNode} from "primeng/primeng";
import * as _ from 'lodash';
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {Nod} from "../../../../model/nod/nod.model";
import {NodItem} from "../../../../model/nod/nodItem.model";
import {OptionItem} from "../../../../model/optionItem/optionItem.model";

@Component({
  selector: 'app-nod-item-content',
  templateUrl: './nod-item-content.component.html',
  styleUrls: ['./nod-item-content.component.scss']
})
export class NodItemContentComponent implements OnInit, OnChanges, OnDestroy {
  selectedFiles: TreeNode[];
  selectedCarTreeNode: TreeNode[] = [];
  selectedControlType: string;
  carTreeNode: TreeNode;
  isOtherInfo: boolean;
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
  loading: boolean = false;
  fastProcessDialog: boolean;
  isFilledCashData: boolean;
  @Input() showLoading: boolean;
  @Input() controlTypeOptions: OptionItem[];
  @Input() currentNodItem: NodItem;
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
  @Output() totalAmountChangeEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() fastProcessEvt: EventEmitter<any> = new EventEmitter<any>();

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

  updateTotalAmount(data: any): NodItem {
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

  changeValueByMSRP(node: any) {
    for (let p in node.data) {
      let basic = p.slice(0, p.indexOf('_'));
      node.data[basic + '_jine'] = this.formatCurrency(node.data['msrp'] * node.data[basic + '_bili'] / 100);
    }
  }

  onChangeValue(node: any, nodeName: string, type: string): any {
    let that = this, result;
    setTimeout(function () {
      that.ngOnChanges();
    });

    if (type === 'RATIO') {
      let checkFieldList = ['financial_bili', 'replacement_bili', 'insurance_bili'];
      let fieldIsExisted = checkFieldList.indexOf(nodeName);
      let jine = nodeName.slice(0, nodeName.indexOf('_')) + '_jine';

      result = Number(node.data[nodeName]) ? Number(node.data[nodeName]).toFixed(2) : '0.00';

      if (node.data.level === 1) {
        if (node.children && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            // if (fieldIsExisted !== -1) {
            //   if (node.children[i].data['singleCar_jine'] === '0.00') {
            //     window.alert('请设置单车总预算');
            //     node.data[nodeName] = 0;
            //     result = node.data[nodeName].toFixed(2);
            //     break;
            //   }
            // }
            node.children[i].data[nodeName] = result;
            node.children[i].data[jine] = this.formatCurrency(node.children[i].data['msrp'] * node.children[i].data[nodeName] / 100);
          }
        }
      } else if (node.data.level === 2) {
        if (fieldIsExisted !== -1) {
          if (node.data['singleCar_jine'] === '0.00') {
            window.alert('请设置单车总预算');
            node.data[nodeName] = 0;
            result = node.data[nodeName].toFixed(2);
          } else {
            node.data[jine] = this.formatCurrency(node.data['msrp'] * node.data[nodeName] / 100);
            let financial_jine = this.converToNormalValue(node.data['financial_jine']);
            let replacement_jine = this.converToNormalValue(node.data['replacement_jine']);
            let insurance_jine = this.converToNormalValue(node.data['insurance_jine']);
            let singleCar_jine = this.converToNormalValue(node.data['singleCar_jine']);

            let isExceededTotalAmount = (Number(financial_jine) + Number(replacement_jine)
              + Number(insurance_jine)) > Number(singleCar_jine);

            if (isExceededTotalAmount) {
              window.alert('超过单车总预算范围');
              node.data[nodeName] = 0;
              result = node.data[nodeName].toFixed(2);
              node.data[jine] = this.formatCurrency(node.data['msrp'] * node.data[nodeName] / 100);
            }
          }
        }
      }

    } else if (type === 'AMOUNT') {
      if (this.selectedServiceType === 'PROMOTIONAL_AMOUNT') {
        let checkFieldList = ['financial_total_amount', 'replacement_total_amount', 'insurance_total_amount'];
        let fieldIsExisted = checkFieldList.indexOf(nodeName);

        if (fieldIsExisted !== -1) {
          if (node['nocash_total_amount'] === '0.00') {
            window.alert('请设置总金额');
            node[nodeName] = 0;
          } else {
            let financial_total_amount = this.converToNormalValue(node['financial_total_amount']);
            let replacement_total_amount = this.converToNormalValue(node['replacement_total_amount']);
            let insurance_total_amount = this.converToNormalValue(node['insurance_total_amount']);
            let nocash_total_amount = this.converToNormalValue(node['nocash_total_amount']);

            let isExceededTotalAmount = (Number(financial_total_amount) + Number(replacement_total_amount)
              + Number(insurance_total_amount)) > Number(nocash_total_amount);

            if (isExceededTotalAmount) {
              window.alert('超过总金额范围');
              node[nodeName] = 0;
            }
          }
        }

        result = this.formatCurrency(node[nodeName]);

        if (result !== '0.00') {
          this.isFilledCashData = true;
        }

      } else {
        let checkFieldList = ['financial_jine', 'replacement_jine', 'insurance_jine'];
        let fieldIsExisted = checkFieldList.indexOf(nodeName);

        if (node.data.level === 1) {
          if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
              // if (fieldIsExisted !== -1) {
              //   if (node.children[i].data['singleCar_jine'] === '0.00') {
              //     window.alert('请设置单车总预算');
              //     node.data[nodeName] = 0;
              //     break;
              //   } else {
              //     let financial_jine = node.data['financial_jine'] !== '0.00' ? this.converToNormalValue(node.data['financial_jine']) :
              //       this.converToNormalValue(node.children[i].data['financial_jine']);
              //     let replacement_jine = node.data['replacement_jine'] !== '0.00' ? this.converToNormalValue(node.data['replacement_jine']) :
              //       this.converToNormalValue(node.children[i].data['replacement_jine']);
              //     let insurance_jine = node.data['insurance_jine'] !== '0.00' ? this.converToNormalValue(node.data['insurance_jine']) :
              //       this.converToNormalValue(node.children[i].data['insurance_jine']);
              //     let singleCar_jine = this.converToNormalValue(node.children[i].data['singleCar_jine']);
              //
              //     let isExceededTotalAmount = (Number(financial_jine) + Number(replacement_jine)
              //       + Number(insurance_jine)) > Number(singleCar_jine);
              //
              //     if (isExceededTotalAmount) {
              //       window.alert('超过单车总预算范围');
              //       node.data[nodeName] = 0;
              //       break;
              //     }
              //   }
              // }
              node.children[i].data[nodeName] = this.formatCurrency(node.data[nodeName]);
            }
          }
        } else if (node.data.level === 2) {
          if (fieldIsExisted !== -1) {
            if (node.data['singleCar_jine'] === '0.00') {
              window.alert('请设置单车总预算');
              node.data[nodeName] = 0;
            } else {
              let financial_jine = this.converToNormalValue(node.data['financial_jine']);
              let replacement_jine = this.converToNormalValue(node.data['replacement_jine']);
              let insurance_jine = this.converToNormalValue(node.data['insurance_jine']);
              let singleCar_jine = this.converToNormalValue(node.data['singleCar_jine']);

              let isExceededTotalAmount = (Number(financial_jine) + Number(replacement_jine)
                + Number(insurance_jine)) > Number(singleCar_jine);

              if (isExceededTotalAmount) {
                window.alert('超过单车总预算范围');
                node.data[nodeName] = 0;
              }
            }
          }
        }

        result = this.formatCurrency(node.data[nodeName]);
      }
    }
    return result;
  }

  converToNormalValue(value: string) {
    let result = '';

    if (value.indexOf(',') !== -1) {
      let arr = value.split(',');
      for (let i = 0; i < arr.length; i++) {
        result += arr[i];
      }
    } else {
      result = value;
    }

    return result;
  }

  formatCurrency(num) {
    let nums = num.toString().replace(/\$|\,/g, '');
    if (isNaN(nums)) {
      nums = "0";
    }
    let sign: boolean = (nums == (nums = Math.abs(nums)));
    nums = Math.floor(nums * 100 + 0.50000000001);
    let cents: any = nums % 100;
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

  commonSettingData(data: any, fieldName?: string) {
    if (fieldName && fieldName === 'endTime') {
      let date = new Date();
      date.setTime(this.commonSetting['endTime'].getTime());
      date.setFullYear(date.getFullYear() + 2);
      this.commonSetting['releaseTime'] = date;
    }
    this.commonSettingEvt.emit(this.commonSetting);
  }

  setFastProcess(event: Event) {
    event.preventDefault();
    this.fastProcessDialog = true;
  }

  closeFastProcessDialog() {
    this.fastProcessDialog = false;
    this.commonSettingEvt.emit(this.commonSetting);
  }

  chooseRapidProcessType(value: string) {
    if (value === '2') {
      this.isOtherInfo = true;
    } else {
      this.isOtherInfo = false;
      this.commonSetting['fastProcess']['period'] = '';
      this.commonSetting['fastProcess']['releaseSystem'] = '';
      this.commonSetting['fastProcess']['isNeedHold'] = false;
    }
  }

  toggleCash() {
    if (this.isFilledCashData) {
      window.alert('现金和非现金数据无法同时操作');
      return;
    }
    this.isCashModule = true;
  }

  toggleNonCash() {
    if (this.isFilledCashData) {
      window.alert('现金和非现金数据无法同时操作');
      return;
    }
    this.isCashModule = false;
  }

  nodeItemChecked(checked: boolean, node: TreeNode, nodeName: string) {
    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        node.children[i].data[nodeName + '_check'] = checked;
      }
    }
  }

  editCarCategory(event: Event) {
    this.loading = true;
    this.editCarCategoryEvt.emit(event);
  }

  onHide() {
    this.keyword = '';
    this.selectedCars = [..._.uniq(this.selectedCars), ...this.selectedCarTreeNode];
    this.hideDialogEvt.emit(this.selectedCars);
  }

  nodeSelect(data: any) {
    data.node.selected = true;
    this.carTreeNode = this.setChildNodeChecked(data.node, true);
    this.selectedCarTreeNode = [...this.selectedCarTreeNode, ...this.chooseTreeNode(this.carTreeNode)];
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
    data.node.selected = false;
    this.carTreeNode = this.setParentNodeChecked(data.node, false);
    this.carTreeNode = this.setChildNodeChecked(data.node, false);
    this.selectedCarTreeNode = this.filterTreeNode(this.carTreeNode);
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
    if (node.parent) {
      node.parent.selected = checkStatus;
      node.parent.partialSelected = true;
      if (node.parent.parent) {
        node.parent.parent.selected = checkStatus;
        node.parent.parent.partialSelected = true;
      }
    }
    return node;
  }

}
