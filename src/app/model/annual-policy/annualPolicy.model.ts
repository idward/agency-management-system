export class AnnualPolicy {
  constructor(public bonusCode?:string, public bonusDesc?:string, public issueBasis?:string,
              public carPoint?:number, public totalAmount?:number, public expiration?:string,
              public remarks?:string) {
  }
}
