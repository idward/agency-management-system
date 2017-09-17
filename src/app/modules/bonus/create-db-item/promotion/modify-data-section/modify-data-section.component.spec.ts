import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDataSectionComponent } from './modify-data-section.component';

describe('ModifyDataSectionComponent', () => {
  let component: ModifyDataSectionComponent;
  let fixture: ComponentFixture<ModifyDataSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyDataSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyDataSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
