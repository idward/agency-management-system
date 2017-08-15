import {OptionItem} from "../../model/optionItem/optionItem.model";

export const DEPTS: OptionItem[] = [
  new OptionItem('集团', 'JT'),
  new OptionItem('凯迪拉克', 'KDLK'),
  new OptionItem('别克', 'BK'),
  new OptionItem('雪佛兰', 'XFL'),
  new OptionItem('二手车', 'ESC')
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
