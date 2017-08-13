import {Component, Input, Output, EventEmitter, OnInit,} from '@angular/core';

@Component({
  selector: 'app-nod-item-header',
  templateUrl: './nod-item-header.component.html',
  styleUrls: ['./nod-item-header.component.scss']
})
export class NodItemHeaderComponent implements OnInit {
  @Input() nodItemCount:number = 0;
  @Output() createItemEvt:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  createItem() {
    this.createItemEvt.emit(true);
  }

}
