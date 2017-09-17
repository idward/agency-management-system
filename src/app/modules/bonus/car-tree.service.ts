import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {TreeNode} from "primeng/primeng";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import * as _ from 'lodash';

@Injectable()
export class CarTreeService {
  private _url: string = 'http://localhost:3000/carTree';
  //private _url: string = 'http://localhost:8080/service/rest/rewardNod/getVehicleTree/all';
  private _headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private _http: Http) {
  }

  getFilesystem(): Observable<TreeNode[]> {
    return this._http.get(this._url, this._headers)
      .map(res => this.rebuildData(res.json().data) as TreeNode[])
      .catch(this._handleError);
  }

  rebuildData(datas: any): any {
    let finalDatas = [];
    let count = 0;
    for (let i = 0; i < datas.length; i++) {
      let node = {};
      let seriesList = datas[i]['seriesList'];
      node['data'] = this.rebuildNode(0, datas[i]['chineseName'], '');
      node['cash_total_amount'] = '0.00';
      node['nocash_total_amount'] = '0.00';
      node['financial_total_amount'] = '0.00';
      node['financial_total_amount_check'] = false;
      node['replacement_total_amount'] = '0.00';
      node['replacement_total_amount_check'] = false;
      node['insurance_total_amount'] = '0.00';
      node['insurance_total_amount_check'] = false;
      node['total_amount_count'] = count++;
      if (!_.isNil(seriesList) && seriesList.length > 0) {
        let subData = [];
        for (let j = 0; j < seriesList.length; j++) {
          let subNode = {};
          subNode['data'] = this.rebuildNode(1, seriesList[j]['englishName'], '');
          let financeDescriptionList = seriesList[j]['financeDescriptionList'];
          if (!_.isNil(financeDescriptionList) && financeDescriptionList.length > 0) {
            let ssubData = [];
            for (let k = 0; k < financeDescriptionList.length; k++) {
              let ssNode = {};
              ssNode['data'] = this.rebuildNode(2, financeDescriptionList[k]['financeDescriptionContent'], financeDescriptionList[k]['maxMsrp']);
              ssubData = [...ssubData, ssNode];
            }
            subNode['children'] = ssubData;
          }
          subData = [...subData, subNode];
        }
        node['children'] = subData;
      }
      finalDatas = [...finalDatas, node];
    }

    return finalDatas;
  }

  rebuildNode(level: number, name: string, msrp: string) {
    let node = {};
    node['level'] = level;
    node['name'] = name;
    node['msrp'] = msrp;
    node['kaoche_bili'] = '0.00';
    node['kaoche_bili_check'] = false;
    node['kaoche_jine'] = '0.00';
    node['kaoche_jine_check'] = false;
    node['jiaoche_bili'] = '0.00';
    node['jiaoche_bili_check'] = false;
    node['jiaoche_jine'] = '0.00';
    node['jiaoche_jine_check'] = false;
    node['store_bili'] = '0.00';
    node['store_bili_check'] = false;
    node['store_jine'] = '0.00';
    node['store_jine_check'] = false;
    node['singleCar_bili'] = '0.00';
    node['singleCar_jine'] = '0.00';
    node['financial_bili'] = '0.00';
    node['financial_jine'] = '0.00';
    node['financial_jine_check'] = false;
    node['yanbao_bili'] = false;
    node['yanbao_jine'] = '0.00';
    node['yanbao_jine_check'] = false;
    node['replacement_bili'] = '0.00';
    node['replacement_jine'] = '0.00';
    node['replacement_jine_check'] = false;
    node['insurance_bili'] = '0.00';
    node['insurance_jine'] = '0.00';
    node['insurance_jine_check'] = false;
    node['maintenance_bili'] = '0.00';
    node['maintenance_jine'] = '0.00';
    node['maintenance_jine_check'] = false;
    // node['kaoche_total_amount'] = '0.00';
    // node['jiaoche_total_amount'] = '0.00';
    // node['store_total_amount'] = '0.00';
    // node['yanbao_total_amount'] = '0.00';
    // node['maintenance_total_amount'] = '0.00';
    return node;
  }

  private _handleError(error: any): Observable<any> {
    console.log('sever error:', error.json());
    return Observable.throw(error.message || error);
  }

}
