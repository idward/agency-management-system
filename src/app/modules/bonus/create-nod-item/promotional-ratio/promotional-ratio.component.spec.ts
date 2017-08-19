import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalRatioComponent } from './promotional-ratio.component';

describe('PromotionalRatioComponent', () => {
  let component: PromotionalRatioComponent;
  let fixture: ComponentFixture<PromotionalRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionalRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionalRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
