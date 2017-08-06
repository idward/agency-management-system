import {Menu} from "../model/menu/menu.model";
import {ActionReducer, Action} from '@ngrx/store';

export function menuReducer(state: Menu[] = [], action: Action) {
  switch (action.type) {
    case 'TOGGLE_STATUS':
      return state.filter(menu => {
        if (menu.menuId !== action.payload.menuId) {
          menu.selectedStatus = false;
          return menu;
        }
        return Object.assign({}, menu, action.payload);
      });
    case 'FETCH_DATA_API':
      return [...action.payload];
    default:
      return state;
  }
}
