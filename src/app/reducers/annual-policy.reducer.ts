import {Action} from "@ngrx/store";
import {AnnualPolicy} from "../model/annual-policy/annualPolicy.model";

export function AnnualPolicyReducer(state: AnnualPolicy[] = [], action: Action) {
  switch (action.type) {
    case 'ADD_ANNUAL_POLICY':
      return [...state, ...action.payload];
    case 'DEL_ANNUAL_POLICY':
      return state.filter(data => {
        return data.id !== action.payload.id;
      });
    case 'UPDATE_ANNUAL_POLICY':
      return state.map(data => {
        if (data.id === action.payload.id) {
          data = Object.assign({}, action.payload);
        }
        return data;
      });
    case 'EMPTY_ANNUAL_POLICY':
      return state = [];
    default:
      return state;
  }
}
