import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LocalStorageService} from 'angular-2-local-storage';
import {User} from "../../model/user/user.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LocalStorageService]
})
export class LoginComponent implements OnInit {
  user: User;
  loginForm: FormGroup;

  constructor(private _fb: FormBuilder, @Inject('loginService') private _loginService,
              private _localstorge: LocalStorageService, private _router:Router) {
    this.user = new User();

    this.loginForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  loginAuth(data: any) {
    let user = new User();
    user.username = data.username;
    user.password = data.password;
    this._loginService.loginAuth(user)
      .subscribe(data => {
        if (data.success) {
          this._localstorge.set('token', data.data.tokenID);
          let token = this._localstorge.get('token');

          this._loginService.toMainPage(token)
            .subscribe(data => console.log(data));
        }
      });
  }

}
