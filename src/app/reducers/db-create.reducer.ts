import {Action} from "@ngrx/store";

export function dbCreatedReducer(state = [], action: Action) {
  switch (action.type) {
    case 'ADD_CREATED_DB_DATAS':
      return [...state, ...action.payload];
    case 'EMPTY_ALL_CREATED_DBDATAS':
      return state = [];
    default:
      return state;
  }
}

export function dbCreatedFilterReducer(state = (dbDatas: any) => dbDatas, action: Action) {
  switch (action.type) {
    case '':
      return;
    default:
      return state;
  }
}
