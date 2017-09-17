import {NgModule} from '@angular/core';
import {CommonModule,DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {InputTextModule, DropdownModule, ButtonModule, CheckboxModule, CalendarModule} from 'primeng/primeng';
import {TreeTableModule, TreeModule, SharedModule, DialogModule, DataTableModule} from 'primeng/primeng';
import {ConfirmDialogModule, ConfirmationService, PanelModule} from 'primeng/primeng';

import {BonusMainComponent} from './bonus-main/bonus-main.component';
import {NodSettingComponent} from './nod-setting/nod-setting.component';
import {CreateNodItemComponent} from './create-nod-item/create-nod-item.component';
import {NodPromotionComponent} from './create-nod-item/promotion/promotion.component';
import {NodAnnualPolicyComponent} from './create-nod-item/annual-policy/annual-policy.component';
import {DbSettingComponent} from './db-setting/db-setting.component';
import {NodItemHeaderComponent} from './create-nod-item/nod-item-header/nod-item-header.component';
import {NodItemContentComponent} from './create-nod-item/nod-item-content/nod-item-content.component';
import {CreateDbItemComponent} from './create-db-item/create-db-item.component';
import {DBPromotionComponent} from "./create-db-item/promotion/promotion.component";
import {DBAnnualPolicyComponent} from './create-db-item/annual-policy/annual-policy.component';
import { ModifyDataSectionComponent } from './create-db-item/promotion/modify-data-section/modify-data-section.component';
import { SelectDataSectionComponent } from './create-db-item/promotion/select-data-section/select-data-section.component';
import { SaveDataSectionComponent } from './create-db-item/promotion/save-data-section/save-data-section.component';

import {BonusRoutesModule} from "./bonus.routing.module";
import {BonusService} from "./bonus.service";
import {CarTreeService} from "./car-tree.service";
import {OrderModule} from 'ngx-order-pipe';


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
    ConfirmDialogModule,
    DataTableModule,
    PanelModule,
    OrderModule
  ],
  declarations: [
    NodSettingComponent,
    BonusMainComponent,
    CreateNodItemComponent,
    DbSettingComponent,
    NodPromotionComponent,
    NodAnnualPolicyComponent,
    NodItemHeaderComponent,
    NodItemContentComponent,
    CreateDbItemComponent,
    DBPromotionComponent,
    DBAnnualPolicyComponent,
    ModifyDataSectionComponent,
    SelectDataSectionComponent,
    SaveDataSectionComponent
  ],
  providers: [
    {provide: 'BonusService', useClass: BonusService},
    {provide: 'CarTreeService', useClass: CarTreeService},
    ConfirmationService
  ]
})

export class BonusModule {
}
