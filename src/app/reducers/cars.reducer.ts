import {TreeNode} from "primeng/primeng";
import {Action} from "@ngrx/store";

export function carsReducer(state: TreeNode[] = [], action: Action) {
  switch (action.type) {
    case 'GET_CARS':
      return [...state, action.payload];
    default:
      return state;
  }
}

export function carsFilterReducer(state: Function = car => car, action: Action) {
  switch (action.type) {
    case 'CAR_SELECTED':
      return car => car;

    default:
      return state;
  }
}
