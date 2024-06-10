import { TestBed } from '@angular/core/testing';

import { MixLot2Service } from './mix-lot2.service';

describe('MixLot2Service', () => {
  let service: MixLot2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MixLot2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
