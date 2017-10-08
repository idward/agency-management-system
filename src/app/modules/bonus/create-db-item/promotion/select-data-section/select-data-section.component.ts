import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OptionItem} from "../../../../../model/optionItem/optionItem.model";

@Component({
  selector: 'app-select-data-section',
  templateUrl: './select-data-section.component.html',
  styleUrls: ['./select-data-section.component.scss']
})
export class SelectDataSectionComponent implements OnInit {
  selectedBonusType:string;
  @Input() selectedItem: any;
  @Input() datas: any;
  @Input() nodItemOptions: OptionItem[];
  @Output() createItemEvt: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
    this.selectedBonusType = 'PROMOTIONAL_RATIO';
  }

  createNewItem() {
    this.createItemEvt.emit(this.selectedItem);
  }

}
