import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {OptionItem} from "../../../../../model/optionItem/optionItem.model";
import {TYPES} from "../../../../../data/optionItem/optionItem.data";

@Component({
  selector: 'app-modify-data-section',
  templateUrl: './modify-data-section.component.html',
  styleUrls: ['./modify-data-section.component.scss']
})
export class ModifyDataSectionComponent implements OnInit {
  selectedType:string;
  percentage:string;
  createdTypes:OptionItem[];
  @Input() selectedDBDatas:any;
  @Input() editedDBDatas:any;
  @Output() changeValueByPercentEvt:EventEmitter<any> = new EventEmitter<any>()
  @Output() changeValueEvt:EventEmitter<any> = new EventEmitter<any>()

  constructor() {
  }

  ngOnInit() {
    this.createdTypes = TYPES;
  }

  changeValueByPercent() {
    this.changeValueByPercentEvt.emit(Number(this.percentage));
    this.percentage = '';
  }

  valueChange(rowData:any, fieldName:string) {
    this.changeValueEvt.emit({rowData, fieldName});
  }
}
