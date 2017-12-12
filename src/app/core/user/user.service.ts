import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {User} from "../../model/user/user.model";

@Injectable()
export class UserService {

  constructor(private _http:HttpClient, @Inject('AuthenticationService') private _authenService) {
  }

  getUser():Observable<User[]> {
    return
  }

}
