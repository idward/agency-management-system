import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-save-data-section',
  templateUrl: './save-data-section.component.html',
  styleUrls: ['./save-data-section.component.scss']
})
export class SaveDataSectionComponent implements OnInit {
  savedDBDatas:any;

  constructor() { }

  ngOnInit() {
  }

}
