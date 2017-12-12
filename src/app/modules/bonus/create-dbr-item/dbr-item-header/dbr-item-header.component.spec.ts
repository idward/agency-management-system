import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbrItemHeaderComponent } from './dbr-item-header.component';

describe('DbrItemHeaderComponent', () => {
  let component: DbrItemHeaderComponent;
  let fixture: ComponentFixture<DbrItemHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbrItemHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbrItemHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
