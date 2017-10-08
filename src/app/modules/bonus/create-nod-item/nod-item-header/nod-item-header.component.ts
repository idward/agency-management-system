import {Component, Input, Output, EventEmitter, OnInit,} from '@angular/core';
import {OptionItem} from "../../../../model/optionItem/optionItem.model";

@Component({
  selector: 'app-nod-item-header',
  templateUrl: './nod-item-header.component.html',
  styleUrls: ['./nod-item-header.component.scss']
})
export class NodItemHeaderComponent implements OnInit {
  @Input() nodItemCount:number = 0;
  @Input() nodItemOptions:OptionItem[];
  @Input() selectedNodItem:string;
  @Output() createItemEvt:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteItemEvt:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveDraftEvt:EventEmitter<any> = new EventEmitter<any>();
  @Output() previewAllItemsEvt:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sendItemsDataEvt:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeNodItemEvt:EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  createItem() {
    this.createItemEvt.emit(true);
  }

  deleteItem(){
    this.deleteItemEvt.emit(true);
  }

  saveData(type:number) {
    this.saveDraftEvt.emit({type});
  }

  previewAllItems(){
    this.previewAllItemsEvt.emit(true);
  }

  sendItemsData(){
    this.sendItemsDataEvt.emit(true);
  }

  changeNodItem(data:any) {
    this.changeNodItemEvt.emit(data.value);
  }

}
