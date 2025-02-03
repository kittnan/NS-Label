import { TestBed } from '@angular/core/testing';

import { HttpSapPkta117Service } from './http-sap-pkta117.service';

describe('HttpSapPkta117Service', () => {
  let service: HttpSapPkta117Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSapPkta117Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
