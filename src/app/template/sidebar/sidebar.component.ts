import {Component, OnInit} from '@angular/core';
import {Menu} from "../../model/menu/menu.model";
import {MENUS} from "../../data/menu/menu.data";

import {Store} from '@ngrx/store';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  open: boolean = false;
  ob_menus: Observable<Menu[]>;
  menus: Menu[];

  constructor(private store$: Store<Menu[]>) {
    this.ob_menus = this.store$.select('menus');
  }

  ngOnInit(): any {
    this.store$.dispatch({type: 'FETCH_DATA_API', payload: MENUS});
    this.ob_menus.subscribe((menus) => this.menus = menus);
  }

  toggle(menu: Menu) {
    console.log(menu);
    this.store$.dispatch({type: 'TOGGLE_STATUS', payload: menu});
  }

}
