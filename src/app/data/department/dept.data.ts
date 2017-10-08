import {DeptItem} from "../../model/department/deptItem.model";
import {Department} from "../../model/department/dept.model";
export const DEPTS: DeptItem[] = [
  new DeptItem('集团', new Department(4, '集团', 'JT')),
  new DeptItem('凯迪拉克', new Department(2, '凯迪拉克', 'KDLK')),
  new DeptItem('别克', new Department(1, '别克', 'BK')),
  new DeptItem('雪佛兰', new Department(22, '雪佛兰', 'XFL')),
  new DeptItem('二手车', new Department(5, '二手车', 'ESC'))
];
