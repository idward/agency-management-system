import {Action} from "@ngrx/store";
import {NodSHData} from "../model/nod/nod.model";

export function NodDataReducer(state:NodSHData[] = [], action:Action){
  switch (action.type){
    case 'GET_NODSEARCHEDDATA':
      return [...state, ...action.payload];
    default:
      return state;
  }
}

export function NodDataFilterReducer(state = (nodDatas:NodSHData[]) => nodDatas, action: Action){
  switch (action.type){
    case '':
      return;
    default:
      return state;
  }
}
