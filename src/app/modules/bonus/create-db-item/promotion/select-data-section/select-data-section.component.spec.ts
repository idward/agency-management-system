import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDataSectionComponent } from './select-data-section.component';

describe('SelectDataSectionComponent', () => {
  let component: SelectDataSectionComponent;
  let fixture: ComponentFixture<SelectDataSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDataSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDataSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
