import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.scss']
})
export class PageErrorComponent implements OnInit {
  statusCode:number;

  constructor(private _route: ActivatedRoute) {
  }

  ngOnInit() {
    this._route.params.subscribe((params:Params) => {
        this.statusCode = Number(params['code']);
    });
  }

}
