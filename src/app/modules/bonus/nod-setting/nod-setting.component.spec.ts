import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodSettingComponent } from './nod-setting.component';

describe('NodSettingComponent', () => {
  let component: NodSettingComponent;
  let fixture: ComponentFixture<NodSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
