import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDbrItemComponent } from './create-dbr-item.component';

describe('CreateDbrItemComponent', () => {
  let component: CreateDbrItemComponent;
  let fixture: ComponentFixture<CreateDbrItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDbrItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDbrItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
