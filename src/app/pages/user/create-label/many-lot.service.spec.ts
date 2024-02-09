import { TestBed } from '@angular/core/testing';

import { ManyLotService } from './many-lot.service';

describe('ManyLotService', () => {
  let service: ManyLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManyLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
