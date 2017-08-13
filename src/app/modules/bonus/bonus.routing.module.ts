import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BonusMainComponent} from "./bonus-main/bonus-main.component";
import {NodSettingComponent} from "./nod-setting/nod-setting.component";
import {CreateNodItemComponent} from "./create-nod-item/create-nod-item.component";
import {DbSettingComponent} from "./db-setting/db-setting.component";
import {PromotionalRatioComponent} from "./create-nod-item/promotional-ratio/promotional-ratio.component";
import {PromotionalAmountComponent} from "./create-nod-item/promotional-amount/promotional-amount.component";
import {AnnualPolicyComponent} from "./create-nod-item/annual-policy/annual-policy.component";

const routes:Routes = [
  {
    path: 'bonus',
    component: BonusMainComponent,
    children: [
      {
        path: 'nod',
        component: NodSettingComponent
      },
      {
        path: 'create-nod/:nodId',
        component: CreateNodItemComponent,
        children: [
          // {
          //   path: '',
          //   redirectTo: '/bonus/create-nod-item/promotional_ratio',
          //   pathMatch: 'full'
          // },
          {
            path: 'promotional_ratio',
            component: PromotionalRatioComponent
          },
          {
            path: 'promotional_amount',
            component: PromotionalAmountComponent
          },
          {
            path: 'annual_policy',
            component: AnnualPolicyComponent
          }
        ]
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
