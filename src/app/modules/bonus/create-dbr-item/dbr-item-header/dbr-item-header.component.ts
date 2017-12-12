import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OptionItem} from "../../../../model/optionItem/optionItem.model";

@Component({
  selector: 'app-dbr-item-header',
  templateUrl: './dbr-item-header.component.html',
  styleUrls: ['./dbr-item-header.component.scss']
})
export class DbrItemHeaderComponent implements OnInit {
  selectedBonusTypeItem: string;
  selectedLocation: string;
  @Input() bonusTypeItemOptions: OptionItem[];
  @Input() locationOptions: OptionItem[];
  @Input() queryResultDatas: object[];
  @Input() isApprovedDBrDatas:boolean;
  @Output() commonSettingEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() addDBEvt: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() uploadListEvt: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() submitDBRDatasEvt: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  commonSettingData(event: Event, label: string) {
    if (label) {
      let data = {};
      data[label] = event;
      this.commonSettingEvt.emit(data);
    } else {
      this.commonSettingEvt.emit({'description': event.target['value']});
    }
  }

  changeBonusTypeItem(data: any) {
    this.commonSettingEvt.emit({'bonusType': this.selectedBonusTypeItem});
  }

  changeLocation(data: any) {
    this.commonSettingEvt.emit({'location': this.selectedLocation});
  }

  addDBData() {
    this.addDBEvt.emit(true);
  }

  uploadList() {
    this.uploadListEvt.emit(true);
  }

  submitDBRDatas(){
    this.submitDBRDatasEvt.emit(true);
  }

}
