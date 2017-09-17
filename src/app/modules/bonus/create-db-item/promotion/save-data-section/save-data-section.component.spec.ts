import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDataSectionComponent } from './save-data-section.component';

describe('SaveDataSectionComponent', () => {
  let component: SaveDataSectionComponent;
  let fixture: ComponentFixture<SaveDataSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveDataSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDataSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
