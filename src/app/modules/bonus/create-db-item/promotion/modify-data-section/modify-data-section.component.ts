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
  selectedTypeByAnnualPolicy: string;
  selectedDetailByAnnualPolicy: string;
  fastProcessDialog: boolean;
  isOtherInfo: boolean;
  @Input() showButton:boolean;
  @Input() bonusTypeDescription: object;
  @Input() BonusTypeOptions: OptionItem[];
  @Input() BonusDetailsOptions: OptionItem[];
  @Input() isShowByAnnualPolicy: boolean;
  @Input() createdDBType: string;
  @Input() nodItemOptions: OptionItem[];
  @Input() commonSetting: any;
  @Input() editedDBDatas: any;
  @Output() changeValueByPercentEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeValueEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() createNewDBEvt: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() commonSettingEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() uploadSelectedListEvt:EventEmitter<any> = new EventEmitter<any>();
  @Output() downloadSelectedListEvt:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
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

  setFastProcess(evt: Event) {
    evt.preventDefault();
    this.fastProcessDialog = true;
  }

  chooseRapidProcessType(value: string) {
    if (value === '2') {
      this.isOtherInfo = true;
    } else {
      this.isOtherInfo = false;
      this.commonSetting['fastProcess']['period'] = '';
      this.commonSetting['fastProcess']['releaseSystem'] = '';
      this.commonSetting['fastProcess']['isNeedHold'] = false;
    }
  }

  closeFastProcessDialog() {
    this.fastProcessDialog = false;
    console.log(this.commonSetting['fastProcess']);
    this.commonSettingEvt.emit(this.commonSetting);
  }

  uploadSelectedList(evt: any) {
    this.uploadSelectedListEvt.emit(evt);
  }

  downloadSelectedList() {
    this.downloadSelectedListEvt.emit(true);
  }

}
