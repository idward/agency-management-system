import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {TreeNode} from "primeng/primeng";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";

@Injectable()
export class CarTreeService {
  private _url:string = 'http://localhost:3000/data';
  private _headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private _http:Http) {  }

  getFilesystem():Observable<TreeNode[]>{
   return this._http.get(this._url,this._headers)
      .map(res => res.json() as TreeNode[])
      .catch(this._handleError);
  }

  private _handleError(error:any):Observable<any>{
    console.log('sever error:', error.json());
    return Observable.throw(error.message || error);
  }

}
