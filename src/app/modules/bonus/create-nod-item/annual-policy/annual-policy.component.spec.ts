import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPolicyComponent } from './annual-policy.component';

describe('AnnualPolicyComponent', () => {
  let component: AnnualPolicyComponent;
  let fixture: ComponentFixture<AnnualPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
