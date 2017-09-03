import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodAnnualPolicyComponent } from './annual-policy.component';

describe('AnnualPolicyComponent', () => {
  let component: NodAnnualPolicyComponent;
  let fixture: ComponentFixture<NodAnnualPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodAnnualPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodAnnualPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
