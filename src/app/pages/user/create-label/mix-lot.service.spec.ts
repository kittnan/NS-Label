import { TestBed } from '@angular/core/testing';

import { MixLotService } from './mix-lot.service';

describe('MixLotService', () => {
  let service: MixLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MixLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
