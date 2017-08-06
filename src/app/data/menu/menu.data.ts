import {Menu} from "../../model/menu/menu.model";
import {Submenu} from "../../model/menu/submenu.model";
export const MENUS: Menu [] = [
  new Menu(0, '奖金', 'bonus_icon', false, [new Submenu(0, 'NOD', 'nod'), new Submenu(1, 'DB', 'db'), new Submenu(2, 'DBR', 'dbr')]),
  new Menu(1, '折扣', 'discount_icon', false, [new Submenu(0, 'NOD', ''), new Submenu(1, 'DB', '')]),
  new Menu(2, '审批', 'approval_icon', false, [new Submenu(0, 'NOD', ''), new Submenu(1, 'DB', '')]),
  new Menu(3, '设置', 'setting_icon', false, [new Submenu(0, 'NOD', ''), new Submenu(1, 'DB', '')])
];
