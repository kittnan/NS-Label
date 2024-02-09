import { TestBed } from '@angular/core/testing';

import { OneLotService } from './one-lot.service';

describe('OneLotService', () => {
  let service: OneLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
