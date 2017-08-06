import { TestBed, inject } from '@angular/core/testing';

import { CarTreeService } from './car-tree.service';

describe('CarTreeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarTreeService]
    });
  });

  it('should be created', inject([CarTreeService], (service: CarTreeService) => {
    expect(service).toBeTruthy();
  }));
});
