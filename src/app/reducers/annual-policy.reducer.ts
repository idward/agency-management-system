import {Action} from "@ngrx/store";
import {AnnualPolicy} from "../model/annual-policy/annualPolicy.model";

export function AnnualPolicyReducer(state:AnnualPolicy[] = [], action:Action) {
  switch (action.type) {
    case 'GET_ANNUAL_POLICY':
      return [...state];
    case 'ADD_ANNUAL_POLICY':
      return [...state, ...action.payload];
    case 'SAVE_ANNUAL_POLICY':
      return;
    default:
      return state;
  }
}
