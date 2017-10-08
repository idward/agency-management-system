import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

import {OptionItem} from "../../../../../model/optionItem/optionItem.model";
import {TYPES} from "../../../../../data/optionItem/optionItem.data";

@Component({
  selector: 'app-modify-data-section',
  templateUrl: './modify-data-section.component.html',
  styleUrls: ['./modify-data-section.component.scss']
})
export class ModifyDataSectionComponent implements OnInit {
  selectedType: string;
  percentage: string;
  createdTypes: OptionItem[];
  @Input() nodItemOptions:OptionItem[];
  @Input() commonSetting: any;
  @Input() editedDBDatas: any;
  @Output() changeValueByPercentEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeValueEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() createNewDBEvt: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
    this.createdTypes = TYPES;
  }

  changeValueByPercent() {
    this.changeValueByPercentEvt.emit(Number(this.percentage));
    this.percentage = '';
  }

  valueChange(rowData: any, fieldName: string) {
    this.changeValueEvt.emit({rowData, fieldName});
  }

  createNewDB() {
    this.createNewDBEvt.emit(true);
  }
}
