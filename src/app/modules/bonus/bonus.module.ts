import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {InputTextModule, DropdownModule, ButtonModule, CheckboxModule, CalendarModule} from 'primeng/primeng';
import {TreeTableModule, TreeModule, SharedModule, DialogModule} from 'primeng/primeng';

import {NodSettingComponent} from './nod-setting/nod-setting.component';
import {BonusMainComponent} from './bonus-main/bonus-main.component';
import {CreateNodItemComponent} from './create-nod-item/create-nod-item.component';
import { DbSettingComponent } from './db-setting/db-setting.component';

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
    DialogModule
  ],
  declarations: [
    NodSettingComponent,
    BonusMainComponent,
    CreateNodItemComponent,
    DbSettingComponent
  ],
  providers: [
    {provide: 'BonusService', useClass: BonusService},
    {provide: 'CarTreeService',useClass:CarTreeService}
  ]
})

export class BonusModule {
}
