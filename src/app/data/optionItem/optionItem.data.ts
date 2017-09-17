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
];

export const NODITEMS: OptionItem[] = [
  new OptionItem('item001','aaaaa'),
  new OptionItem('item002','bbbbb')
];

export const BONUSTYPEDESC:OptionItem[] = [
  new OptionItem('请选择...','请选择...'),
  new OptionItem('销售满意度','销售满意度'),
  new OptionItem('客户忠诚度','客户忠诚度'),
  new OptionItem('销售达标奖','销售达标奖'),
  new OptionItem('销售节奏奖','销售节奏奖'),
  new OptionItem('进货达标奖','进货达标奖'),
  new OptionItem('市场份额达标奖','市场份额达标奖'),
  new OptionItem('重点车型及配置奖','重点车型及配置奖'),
  new OptionItem('销售日常管理奖','销售日常管理奖'),
  new OptionItem('售后日常管理奖','售后日常管理奖'),
  new OptionItem('销售星级奖','销售星级奖')
]

export const ISSUEBASIS:OptionItem[] = [
  new OptionItem('请选择...','请选择...'),
  new OptionItem('交车','交车'),
  new OptionItem('拷车','拷车'),
  new OptionItem('经销商','经销商')
]
