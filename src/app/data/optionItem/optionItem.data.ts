import {OptionItem} from "../../model/optionItem/optionItem.model";

export const TYPES: OptionItem[] = [
  new OptionItem('促销方式', 'PROMOTION'),
  new OptionItem('年度政策', 'ANNUAL_POLICY')
];

export const DEPTS: OptionItem[] = [
  new OptionItem('集团', '4'),
  new OptionItem('凯迪拉克', '2'),
  new OptionItem('别克', '1'),
  new OptionItem('雪佛兰', '22'),
  new OptionItem('二手车', '5')
];

export const SERVICETYPES: OptionItem[] = [
  new OptionItem('促销比例', 'PROMOTIONAL_RATIO'),
  new OptionItem('促销金额', 'PROMOTIONAL_AMOUNT')
];

export const NODITEMS: OptionItem[] = [
  new OptionItem('item001', 'aaaaa'),
  new OptionItem('item002', 'bbbbb')
];

export const BONUSTYPEDESC: OptionItem[] = [
  new OptionItem('请选择...', ''),
  new OptionItem('整车达标奖', '整车达标奖'),
  new OptionItem('销量达标奖', '销量达标奖'),
  new OptionItem('进货达标奖', '进货达标奖'),
  new OptionItem('市场份额达标奖', '市场份额达标奖'),
  new OptionItem('配件达标奖', '配件达标奖'),
  new OptionItem('销售满意度奖', '销售满意度奖'),
  new OptionItem('售后满意度奖', '售后满意度奖'),
  new OptionItem('销售星级奖', '销售星级奖'),
  new OptionItem('售后星级奖', '售后星级奖'),
  new OptionItem('销售日常管理奖', '销售日常管理奖'),
  new OptionItem('售后日常管理奖', '售后日常管理奖'),
  new OptionItem('销售&售后明访奖', '销售&售后明访奖'),
  new OptionItem('客户维系奖', '客户维系奖'),
  new OptionItem('客户忠诚度', '客户忠诚度'),
  new OptionItem('销售节奏奖', '销售节奏奖'),
  new OptionItem('重点车型及配置奖', '重点车型及配置奖'),
  new OptionItem('进货准确率奖', '进货准确率奖'),
  new OptionItem('区域支持奖', '区域支持奖'),
  new OptionItem('衍生业务管理奖', '衍生业务管理奖'),
  new OptionItem('数字化客户体验奖', '数字化客户体验奖'),
  new OptionItem('市场支持基金', '市场支持基金')
];

export const ISSUEBASIS: OptionItem[] = [
  new OptionItem('请选择...', ''),
  new OptionItem('交车', '交车'),
  new OptionItem('拷车', '拷车'),
  new OptionItem('经销商库存', '经销商库存')
];
