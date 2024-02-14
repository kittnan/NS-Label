import { TestBed } from '@angular/core/testing';

import { HttpSendingService } from './http-sending.service';

describe('HttpSendingService', () => {
  let service: HttpSendingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSendingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
