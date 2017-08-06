import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BonusMainComponent} from "./bonus-main/bonus-main.component";
import {NodSettingComponent} from "./nod-setting/nod-setting.component";
import {CreateNodItemComponent} from "./create-nod-item/create-nod-item.component";
import {DbSettingComponent} from "./db-setting/db-setting.component";

const routes: Routes = [
  {
    path: 'bonus',
    component: BonusMainComponent,
    children: [
      {
        path: 'nod',
        component: NodSettingComponent
      },
      {
        path: 'create-nod-item',
        component: CreateNodItemComponent
      },
      {
        path: 'db',
        component: DbSettingComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})


export class BonusRoutesModule {
}
;
