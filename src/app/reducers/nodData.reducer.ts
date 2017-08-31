import {Action} from "@ngrx/store";
import {NodSHData} from "../model/nod/nod.model";
import * as _ from 'lodash';

export function NodDataReducer(state:NodSHData[] = [], action:Action){
  switch (action.type){
    case 'GET_NODSEARCHEDDATA':
      return [...state, ...action.payload];
    default:
      return state;
  }
}

export function NodDataFilterReducer(state = (nodData:NodSHData) => nodData, action: Action){
  switch (action.type){
    case 'NOD_SEARCH':
      return nodData => nodData.nodNumber.indexOf(action.payload.toUpperCase()) !== -1
      || nodData.description.indexOf(action.payload) !== -1;
    default:
      return state;
  }
}
