import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-select-data-section',
  templateUrl: './select-data-section.component.html',
  styleUrls: ['./select-data-section.component.scss']
})
export class SelectDataSectionComponent implements OnInit {
  selectedItem: any;
  @Input() datas: any;
  @Output() createItemEvt: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  createNewItem() {
    this.createItemEvt.emit(this.selectedItem);
  }

}
