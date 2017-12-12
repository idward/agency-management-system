import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrItemContentComponent } from './dbr-item-content.component';

describe('DbrItemContentComponent', () => {
  let component: DbrItemContentComponent;
  let fixture: ComponentFixture<DbrItemContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbrItemContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
