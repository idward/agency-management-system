import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DBPromotionComponent } from './promotion.component';

describe('PromotionComponent', () => {
  let component: DBPromotionComponent;
  let fixture: ComponentFixture<DBPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DBPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DBPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
