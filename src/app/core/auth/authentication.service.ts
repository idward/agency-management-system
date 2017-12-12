import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';
import {AuthService} from 'ngx-auth';

@Injectable()
export class AuthenticationService implements AuthService {
  // token: string;
  // private _internalUrl: string = 'http://localhost:3000';
  // private _externalUrl: string = 'http://localhost:8080/service/rest';
  // private _publishUrl: string = 'http://10.203.102.119/service/rest';
  // private _normalUrl: string = 'http://10.203.102.120:8001/service/rest';
  // private _url: string;

  constructor(private _http: HttpClient) {
    // this._url = this.setAPIUrl(this._externalUrl);
    // console.log('auth:', this._url);
    //
    // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // this.token = currentUser && currentUser.token;
  }

  // setAPIUrl(url: string): string {
  //   return url;
  // }

  public isAuthorized(): Observable<boolean> {
    const isAuthorized: boolean = !!localStorage.getItem('accessToken');
    return Observable.of(isAuthorized);
  }

  public getAccessToken(): Observable<string> {
    const accessToken: string = localStorage.getItem('accessToken');
    return Observable.of(accessToken);
  }

  public refreshToken(): Observable<any> {
    const refreshToken: string = localStorage.getItem('refreshToken');
    return this._http.post('http://localhost:3001/refresh-token', {refreshToken})
      .catch(this._handleError);
  }

  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return response.status === 401;
  }

  public verifyTokenRequest(url: string): boolean {
    return url.endsWith('refresh-token');
  }

  public getHeaders(token: string): {
    [name: string]: string | string[];
  } {
    throw new Error("Method not implemented.");
  }


  // login(username: string, password: string): Observable<boolean> {
  //   let body = {username: username, password: password};
  //
  //   return this._http.get(this._url + '/auth/login/' + username)
  //     .map(res => {
  //       debugger;
  //       let token = res['data'] && res['data']['tokenID'];
  //
  //       if (token) {
  //         this.token = token;
  //         let savedUser = {username: username, token: token};
  //         localStorage.setItem('currentUser', JSON.stringify(savedUser));
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     })
  //     .catch(this._handleError);
  // }
  //
  // logout() {
  //   this.token = null;
  //   localStorage.removeItem('currentUser');
  // }

  private _handleError(error: any): Observable<any> {
    if (error.status < 400 || error.status == 500) {
      return Observable.throw(new Error(error.status));
    } else if (error.status === 400 || error.status === 415) {
      return Observable.throw(new Error(error.status));
    }
  }
}
