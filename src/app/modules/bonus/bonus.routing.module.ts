import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BonusMainComponent} from "./bonus-main/bonus-main.component";
import {NodSettingComponent} from "./nod-setting/nod-setting.component";
import {CreateNodItemComponent} from "./create-nod-item/create-nod-item.component";
import {DbSettingComponent} from "./db-setting/db-setting.component";
import {NodAnnualPolicyComponent} from "./create-nod-item/annual-policy/annual-policy.component";
import {NodPromotionComponent} from "./create-nod-item/promotion/promotion.component";
import {CreateDbItemComponent} from "./create-db-item/create-db-item.component";
import {DBPromotionComponent} from "./create-db-item/promotion/promotion.component";
import {DBAnnualPolicyComponent} from "./create-db-item/annual-policy/annual-policy.component";

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
        path: 'create-nod',
        component: CreateNodItemComponent,
        children: [
          {
            path: 'promotion/:nodId',
            component: NodPromotionComponent
          },
          {
            path: 'annual-policy/:nodId',
            component: NodAnnualPolicyComponent
          }
        ]
      },
      {
        path: 'db',
        component: DbSettingComponent
      },
      {
        path: 'create-db',
        component: CreateDbItemComponent,
        children: [
          {
            path: 'promotion/:dbId',
            component: DBPromotionComponent
          },
          {
            path: 'annual-policy/:dbId',
            component: DBAnnualPolicyComponent
          }
        ]
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
};
