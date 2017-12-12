import {Action} from "@ngrx/store";

export function dbCreatedReducer(state = [], action: Action) {
  switch (action.type) {
    case 'ADD_CREATED_DB_DATAS':
      return [...state, ...action.payload];
    case 'DELETE_CREATED_DB_DATA':
      return state.filter(data => {
        return data.dbItemNumber !== action.payload['itemNumber'];
      });
    case 'EMPTY_ALL_CREATED_DBDATAS':
      return state = [];
    default:
      return state;
  }
}

export function dbCreatedFilterReducer(state = (dbData: any) => dbData, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
