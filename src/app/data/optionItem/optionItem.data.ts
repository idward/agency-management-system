import {OptionItem} from "../../model/optionItem/optionItem.model";

export const TYPES: OptionItem[] = [
  new OptionItem('促销方式','PROMOTION'),
  new OptionItem('年度政策','ANNUAL_POLICY')
];

export const DEPTS: OptionItem[] = [
  new OptionItem('集团', '1'),
  new OptionItem('凯迪拉克', '2'),
  new OptionItem('别克', '3'),
  new OptionItem('雪佛兰', '4'),
  new OptionItem('二手车', '5')
];

export const SERVICETYPES: OptionItem[] = [
  new OptionItem('促销比例','PROMOTIONAL_RATIO'),
  new OptionItem('促销金额','PROMOTIONAL_AMOUNT')
  // new OptionItem('年度政策','ANNUAL_POLICY')
];

export const NODITEMS: OptionItem[] = [
  new OptionItem('item001','aaaaa'),
  new OptionItem('item002','bbbbb')
];
