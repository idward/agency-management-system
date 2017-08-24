import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalAmountComponent } from './promotional-amount.component';

describe('PromotionalAmountComponent', () => {
  let component: PromotionalAmountComponent;
  let fixture: ComponentFixture<PromotionalAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionalAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
