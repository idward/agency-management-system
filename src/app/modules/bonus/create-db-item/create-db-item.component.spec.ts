import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDbItemComponent } from './create-db-item.component';

describe('CreateDbItemComponent', () => {
  let component: CreateDbItemComponent;
  let fixture: ComponentFixture<CreateDbItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDbItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDbItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
