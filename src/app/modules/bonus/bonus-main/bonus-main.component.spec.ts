import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusMainComponent } from './bonus-main.component';

describe('BonusMainComponent', () => {
  let component: BonusMainComponent;
  let fixture: ComponentFixture<BonusMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
