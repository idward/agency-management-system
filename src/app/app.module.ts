import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools'
import {menuReducer} from './reducers/menu.reducer';
import {carsFilterReducer, carsReducer} from "./reducers/cars.reducer";
import {carTreeReducer, carTreeFilterReducer} from './reducers/cars-tree.reducer';
import {nodItemFilterReducer, nodItemReducer} from "./reducers/nodItem.reducer";
import {AnnualPolicyReducer} from "./reducers/annual-policy.reducer";

import {AppRoutesModule} from "./route/app.routing.module";
import {BonusModule} from "./modules/bonus/bonus.module";

import {AppComponent} from './app.component';
import {HeaderComponent} from "./template/header/header.component";
import {FooterComponent} from "./template/footer/footer.component";
import {SidebarComponent} from "./template/sidebar/sidebar.component";
import {MenuListComponent} from "./template/sidebar/menu-list/menu-list.component";
import {MenuItemComponent} from "./template/sidebar/menu-item/menu-item.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MenuListComponent,
    MenuItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutesModule,
    StoreModule.provideStore({
      menus: menuReducer,
      carTree: carTreeReducer,
      carTreeFilter: carTreeFilterReducer,
      carDatas: carsReducer,
      carDatasFilter: carsFilterReducer,
      nodItemDatas: nodItemReducer,
      nodItemDataFilter: nodItemFilterReducer,
      annualPolicyDatas: AnnualPolicyReducer
    }),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    BonusModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
