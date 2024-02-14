import { TestBed } from '@angular/core/testing';

import { HttpFormService } from './http-form.service';

describe('HttpFormService', () => {
  let service: HttpFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
