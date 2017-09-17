import {Action} from "@ngrx/store";

export function dbSelectReducer(state = [], action:Action) {
  switch (action.type) {
    case 'GET_SELECTED_DATAS':
      return [...state];
    case 'ADD_SELECTED_DATAS':
      return [...state, ...action.payload];
    case 'EMPTY_ALL_SELDBDATAS':
      return state = [];
    default:
      return state;
  }
}

export function dbSelectFilterReducer(state = (dbSelData:any) => dbSelData, action:Action) {
  switch (action.type) {
    default:
      return state;
  }
}
