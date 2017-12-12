import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {Message} from 'primeng/primeng';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: string;
  password: string;
  loginResultInfo: Message[];

  constructor(private _fb: FormBuilder, private _router: Router,
              @Inject('AuthenticationService') private _authenService) {
    this.loginForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  loginAuth(data: any) {
    console.log(data);
    let username = data.username;
    let password = data.password;
    this._authenService.login(username, password)
      .subscribe(result => {
        debugger;
        if (result) {
          this.loginResultInfo = [];
          this.loginResultInfo.push({severity: 'success', summary: '', detail: '登录成功！'});
          setTimeout(() => {
            this._router.navigate(['/']);
          }, 3000);

        } else {
          this.loginResultInfo = [];
          this.loginResultInfo.push({severity: 'error', summary: '', detail: '登录失败, 用户名或密码不正确!'});
        }
      });
  }

}
