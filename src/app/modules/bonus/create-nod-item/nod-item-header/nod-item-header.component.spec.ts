import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodItemHeaderComponent } from './nod-item-header.component';

describe('NodItemHeaderComponent', () => {
  let component: NodItemHeaderComponent;
  let fixture: ComponentFixture<NodItemHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodItemHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodItemHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
