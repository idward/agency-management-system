import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {LoginService} from "./login.service";

import {InputTextModule, ButtonModule} from 'primeng/primeng';
import {LoginComponent} from './login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    InputTextModule,
    ButtonModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    {provide: 'loginService', useClass: LoginService}
  ]
})
export class LoginModule {
}
