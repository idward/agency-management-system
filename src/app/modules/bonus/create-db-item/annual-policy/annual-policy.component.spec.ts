import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DBAnnualPolicyComponent } from './annual-policy.component';

describe('AnnualPolicyComponent', () => {
  let component: DBAnnualPolicyComponent;
  let fixture: ComponentFixture<DBAnnualPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DBAnnualPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DBAnnualPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
