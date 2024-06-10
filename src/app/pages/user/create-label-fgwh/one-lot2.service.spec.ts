import { TestBed } from '@angular/core/testing';

import { OneLot2Service } from './one-lot2.service';

describe('OneLot2Service', () => {
  let service: OneLot2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneLot2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
