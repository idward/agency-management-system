import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {InputTextModule, DropdownModule, ButtonModule, CheckboxModule, CalendarModule} from 'primeng/primeng';
import {TreeTableModule, TreeModule, SharedModule, DialogModule} from 'primeng/primeng';
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';

import {BonusMainComponent} from './bonus-main/bonus-main.component';
import {NodSettingComponent} from './nod-setting/nod-setting.component';
import {CreateNodItemComponent} from './create-nod-item/create-nod-item.component';
import {PromotionalRatioComponent} from './create-nod-item/promotional-ratio/promotional-ratio.component';
import {PromotionalAmountComponent} from './create-nod-item/promotional-amount/promotional-amount.component';
import {AnnualPolicyComponent} from './create-nod-item/annual-policy/annual-policy.component';
import {DbSettingComponent} from './db-setting/db-setting.component';
import {NodItemHeaderComponent} from './create-nod-item/nod-item-header/nod-item-header.component';
import {NodItemContentComponent} from './create-nod-item/nod-item-content/nod-item-content.component';

import {BonusRoutesModule} from "./bonus.routing.module";
import {BonusService} from "./bonus.service";
import {CarTreeService} from "./car-tree.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BonusRoutesModule,
    BrowserAnimationsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CheckboxModule,
    CalendarModule,
    TreeTableModule,
    TreeModule,
    SharedModule,
    DialogModule,
    ConfirmDialogModule
  ],
  declarations: [
    NodSettingComponent,
    BonusMainComponent,
    CreateNodItemComponent,
    DbSettingComponent,
    PromotionalRatioComponent,
    PromotionalAmountComponent,
    AnnualPolicyComponent,
    NodItemHeaderComponent,
    NodItemContentComponent
  ],
  providers: [
    {provide: 'BonusService', useClass: BonusService},
    {provide: 'CarTreeService', useClass: CarTreeService},
    ConfirmationService
  ]
})

export class BonusModule {
}
