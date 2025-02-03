import { TestBed } from '@angular/core/testing';

import { HttpSapSendingService } from './http-sap-sending.service';

describe('HttpSapSendingService', () => {
  let service: HttpSapSendingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSapSendingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
