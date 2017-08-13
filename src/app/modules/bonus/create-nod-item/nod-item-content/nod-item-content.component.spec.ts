import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodItemContentComponent } from './nod-item-content.component';

describe('NodItemContentComponent', () => {
  let component: NodItemContentComponent;
  let fixture: ComponentFixture<NodItemContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodItemContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
