import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "../modules/login/login.component";
import {PageErrorComponent} from "../error-page/error/page-error.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bonus',
    pathMatch: 'full'
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

export class AppRoutesModule {
}
;
