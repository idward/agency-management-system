import {Action} from '@ngrx/store';
import {NodItem} from "../model/nod/nodItem.model";
import * as _ from 'lodash';

export function nodItemReducer(state: NodItem[] = [], action: Action) {
  switch (action.type) {
    case 'CREATE_NODITEM':
      return [...state, ...action.payload];
    case 'UPDATE_NODEITEM':
      let idx = _.findIndex(state, function (o) {
        return o.nodItem_id === action.payload.nodItem_id;
      });
      if (idx !== -1) {
        state = [...state.slice(0, idx), action.payload, ...state.slice(idx + 1)];
        debugger;
      }
      return state;
    case 'DELETE_NODITEM':
      return state.filter(data => {
        return data.nodItem_id !== action.payload;
      });
    default:
      return state;
  }
}

export function nodItemFilterReducer(state = (nodItem: NodItem) => nodItem, action: Action) {
  switch (action.type) {
    case 'GET_NODITEM':
      return (nodItem: NodItem) => nodItem.nodItem_id === action.payload;
    default:
      return state;
  }
}
