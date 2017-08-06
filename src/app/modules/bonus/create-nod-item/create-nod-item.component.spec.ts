import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNodItemComponent } from './create-nod-item.component';

describe('CreateNodItemComponent', () => {
  let component: CreateNodItemComponent;
  let fixture: ComponentFixture<CreateNodItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNodItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNodItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
