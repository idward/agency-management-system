import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbSettingComponent } from './db-setting.component';

describe('DbSettingComponent', () => {
  let component: DbSettingComponent;
  let fixture: ComponentFixture<DbSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
