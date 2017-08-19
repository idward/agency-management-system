import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {subscribeOn} from "rxjs/operator/subscribeOn";

@Component({
  selector: 'app-db-setting',
  templateUrl: './db-setting.component.html',
  styleUrls: ['./db-setting.component.scss']
})
export class DbSettingComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    // let todo = document.body.querySelector('#todo');
    // let input$ = Observable.fromEvent(todo,'keyup').map(input => input['target'].value);
    //
    // let addBtn = document.body.querySelector('#addBtn');
    // let buttonclick$ = Observable.fromEvent(addBtn,'click').mapTo('clicked');
    //
    // Observable.combineLatest(buttonclick$,input$,(ev,input) => {
    //   return {ev:ev,input:input};
    // }).subscribe(value => console.log(value));
    //
    // let greetings = ['Hello','How are you','How are you doing'];
    // let time = 3000;
    // let item$ = Observable.from(greetings);
    // let interval$ = Observable.interval(time);
    //
    // Observable.zip(item$,interval$,(item,index) => {
    //   return {item:item,index:index};
    // }).subscribe(result => console.log('item: ' + result.item + ' index: '
    //   + result.index + ' at ' + new Date()));

    //let a = document.body.querySelector('#a');
    // let b = document.body.querySelector('#b');
    // let result = document.body.querySelector('#r');
    //
    //let a$ = Observable.fromEvent(a, 'input').pluck('target', 'value');
    // let b$ = Observable.fromEvent(b, 'input').pluck('target', 'value');
    //
    // let result$ = Observable.merge(a$, b$);
    // result$.subscribe(value => result.innerHTML = value + '');
    let source = Observable.timer(2000).mapTo('ggg');
    source.subscribe(data => console.log('Next: ' + data));

  }

}
