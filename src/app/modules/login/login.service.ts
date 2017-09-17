import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {User} from "../../model/user/user.model";
import {Observable} from "rxjs/Observable";

@Injectable()
export class LoginService {
  private _url: string = 'http://localhost:3000/';
  private _headers = new Headers({
    'Content-Type': 'application/json'
  });
  private _options = new RequestOptions({headers: this._headers});

  constructor(private _http: Http) {

  }

  loginAuth(user: User):Observable<any> {
    console.log('User:', user);
    return this._http.get(this._url + 'auth', this._options)
      .map(data => data.json())
      .catch(this._handleError);
  }

  toMainPage(token):Observable<any>{
    let headers = new Headers({
      'Content-Type':'application/json',
      'Authorization': token
    });
    let options = new RequestOptions({headers:headers});
    return this._http.get(this._url + 'auth', options)
      .map(data => data.json())
      .catch(this._handleError);
  }

  private _handleError(error: any): Observable<any> {
    console.log('sever error:', error.json());
    return Observable.throw(error.message || error);
  }

}
