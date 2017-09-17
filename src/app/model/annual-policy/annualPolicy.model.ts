export class AnnualPolicy {
  constructor(public id?: string, public bonusTypeDesc?: string, public issueBasis?: string,
              public carPoint?: string, public totalAmount?: string,
              public isPercentUsed?:boolean, public isAmountUsed?:boolean,
              public expStartTime?: Date, public expEndTime?: Date,
              public remarks?: string) {
  }
}
