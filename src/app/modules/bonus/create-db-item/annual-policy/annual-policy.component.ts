import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-annual-policy',
  templateUrl: './annual-policy.component.html',
  styleUrls: ['./annual-policy.component.scss']
})
export class DBAnnualPolicyComponent implements OnInit {
  dataList:any;

  constructor() { }

  ngOnInit() {
    this.dataList = [
      {name:'a1', age:21},
      {name:'a2', age:22},
      {name:'a3', age:23},
      {name:'a4', age:24},
      {name:'a5', age:25},
      {name:'a6', age:26},
      {name:'a7', age:27},
    ]
  }

}
