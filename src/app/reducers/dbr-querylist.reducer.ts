import {Action} from "@ngrx/store";

export function DbrQueryListReducer(state: any = [], action: Action) {
  switch (action.type) {
    case 'ADD_QUERY_DBLIST':
      return [...state, ...action.payload];
    case 'EMPTY_QUERY_DBLIST':
      return state = [];
    default:
      return state;
  }
}

export function SelectedDbrDataReducer(state: any = [], action: Action) {
  switch (action.type) {
    case 'ADD_SELECTED_DBRDATAS':
      return [...state, ...action.payload];
    case 'EMPTY_SELECTED_DBRDATAS':
      return state = [];
    default:
      return state;
  }
}

export function DbrQueryListFilterReducer(state: any = (dbQueryData) => dbQueryData, action: Action) {
  switch (action.type) {
    case 'SELECT_DBITEM':
      return;
    default:
      return state;
  }
}

export function SelectedDbrDataFilterReducer(state: any = (selectedDBItem) => selectedDBItem, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
