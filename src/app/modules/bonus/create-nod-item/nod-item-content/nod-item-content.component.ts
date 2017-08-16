import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NodItem} from "../../../../model/nod/nodItem.model";

@Component({
  selector: 'app-nod-item-content',
  templateUrl: './nod-item-content.component.html',
  styleUrls: ['./nod-item-content.component.scss']
})
export class NodItemContentComponent implements OnInit {
  @Input() selectedServiceType: string;
  @Input() commonSetting: any;
  @Output() commonSettingEvt: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  commonSettingData(data:any){
    this.commonSettingEvt.emit(this.commonSetting);
  }

}
