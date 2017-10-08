import {Action} from "@ngrx/store";

export function dbReducer(state: any = [], action: Action) {
  switch (action.type) {
    case 'ADD_DB_DATAS':
      return [...state, ...action.payload];
    case 'EMPTY_ALL_NODITEMDATAS':
      return state = [];
    default:
      return state;
  }
}

export function dbFilterReducer(state = (dbDatas: any) => dbDatas, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}


