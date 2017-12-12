import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dbr-item-content',
  templateUrl: './dbr-item-content.component.html',
  styleUrls: ['./dbr-item-content.component.scss']
})
export class DbrItemContentComponent implements OnInit {
  @Input() queryResultDatas: object[];
  @Input() matchResultDatas: object[];
  @Input() uploadListDatas: object[];

  constructor() {
  }

  ngOnInit() {
  }

}
