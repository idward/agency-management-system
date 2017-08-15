import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NodItem} from "../../../../model/nod/nodItem.model";

@Component({
  selector: 'app-nod-item-content',
  templateUrl: './nod-item-content.component.html',
  styleUrls: ['./nod-item-content.component.scss']
})
export class NodItemContentComponent implements OnInit {
  @Input() selectedServiceType: string;
  @Input() commonSetting: NodItem;
  @Output() commonSettingEvt: EventEmitter<any> = new EventEmitter<any>();
  startTime: any;
  endTime: any;
  releaseTime: any;
  isFastProcess: boolean;
  isApproval: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  showStartTime(data: any) {
    let st = {startTime: data.getTime()};
    this.commonSettingEvt.emit(st);
  }

  showEndTime(data: any) {
    let et = {endTime: data.getTime()};
    this.commonSettingEvt.emit(et);
  }

  showReleaseTime(data: any) {
    let rt = {releaseTime: data.getTime()};
    this.commonSettingEvt.emit(rt);
  }

  inputDesc(data: any) {
    let desc = {description: data};
    this.commonSettingEvt.emit(desc);
  }

  fastProcess(data: any) {
    let fp = {isFastProcess: data ? 1 : 0};
    this.commonSettingEvt.emit(fp);
  }

  approvalDB(data: any) {
    let db = {isApprovalDb: data ? 1 : 0};
    this.commonSettingEvt.emit(db);
  }

}
