import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Menu} from "../../../model/menu/menu.model";

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() itemId:number = 0;
  @Input() open:boolean = false;
  @Input() menu:Menu;
  @Output() toggleChildEvt:EventEmitter<Menu> = new EventEmitter<Menu>();

  constructor() { }

  ngOnInit() {
  }

  toggleMenu(evt:Event){
    evt.preventDefault();
    this.menu.selectedStatus = !this.menu.selectedStatus;
    this.toggleChildEvt.emit(this.menu);
  }

}
