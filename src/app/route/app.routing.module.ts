import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "../modules/login/login.component";
import {PageErrorComponent} from "../error-page/error/page-error.component";
import {HomeComponent} from "../modules/home/home.component";
import {AuthGuard} from "../core/auth/auth.guard";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'error/:code',
    component: PageErrorComponent
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutesModule {};
