import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodPromotionComponent } from './promotion.component';

describe('PromotionComponent', () => {
  let component: NodPromotionComponent;
  let fixture: ComponentFixture<NodPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
