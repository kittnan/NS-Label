import { TestBed } from '@angular/core/testing';

import { ManyLot2Service } from './many-lot2.service';

describe('ManyLot2Service', () => {
  let service: ManyLot2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManyLot2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
