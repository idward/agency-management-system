export class AnnualPolicy {
  constructor(public bonusTypeDesc?: string, public issueBasis?: string,
              public carPoint?: number, public totalAmount?: number,
              public expStartTime?: Date, public expEndTime?: Date,
              public remarks?: string) {}
}
