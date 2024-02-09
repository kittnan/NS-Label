import { TestBed } from '@angular/core/testing';

import { HttpPkta117Service } from './http-pkta117.service';

describe('HttpPkta117Service', () => {
  let service: HttpPkta117Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpPkta117Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
