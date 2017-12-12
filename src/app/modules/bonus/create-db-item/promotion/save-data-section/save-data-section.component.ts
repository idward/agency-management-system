import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-save-data-section',
  templateUrl: './save-data-section.component.html',
  styleUrls: ['./save-data-section.component.scss']
})
export class SaveDataSectionComponent implements OnInit {
  isFastProcess: boolean;
  @Input() bonusTypeDescription: object;
  @Input() savedDBDatas: any;
  @Output() approvalProcessEvt: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteDBItemEvt: EventEmitter<any> = new EventEmitter<any>();
  @Output() modifyDBItemEvt: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {

  }

  approvalProcess() {
    this.approvalProcessEvt.emit(true);
  }

  deleteDBItem(event: Event, dbItemNum: string) {
    event.preventDefault();
    this.deleteDBItemEvt.emit({itemNumber: dbItemNum});
  }

  modifyDBItem(event: Event, dbItemNum: string) {
    event.preventDefault();
    this.modifyDBItemEvt.emit({itemNumber: dbItemNum});
  }

}
