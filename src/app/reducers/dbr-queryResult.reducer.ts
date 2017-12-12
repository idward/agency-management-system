import {Action} from "@ngrx/store";

export function DbrQueryResultReducer(state: any = [], action: Action) {
    switch (action.type){
      case 'ADD_QUERY_RESULT_DATAS':
        return state = [...state,...action.payload];
      case 'EMPTY_QUERY_RESULT_DATAS':
        return state = [];
      default:
        return state;
    }
}
