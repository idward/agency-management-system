export class Nod {
  constructor(public nodId: string, public desc?: string, public department?: string, public createdType?: string,
              public nodYear?: string, public nodList?: Array<any>) {
  }
}

export class NodSHData {
  constructor(public createBy: string, public createDate: number, public description: string,
              public items: any, public nodBaseInfoId: string, public nodNumber: string,
              public nodState: string, public nodYear: string, public updateBy: string,
              public updateDate: number, public useDepartment: number) {
  }
}

export interface SelectedNodItem {
  itemName: string,
  itemValue: string
}
