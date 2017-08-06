import {Submenu} from "./submenu.model";
export class Menu {
  constructor(public menuId: number, public menuName: string, public menuClass:string,
              public selectedStatus:boolean, public subMenus:Submenu []) {}
}
