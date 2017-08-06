import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {Menu} from "../../../model/menu/menu.model";

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  @Input() open:boolean = false;
  @Input() menusData:Menu [] = [];
  @Output() toggleParentEvt:EventEmitter<Menu> = new EventEmitter<Menu>();

  constructor() { }

  ngOnInit() {
  }

  toggleMenu(menu:Menu){
    this.toggleParentEvt.emit(menu);
  }

}
