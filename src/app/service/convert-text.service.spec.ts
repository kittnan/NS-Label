import { TestBed } from '@angular/core/testing';

import { ConvertTextService } from './convert-text.service';

describe('ConvertTextService', () => {
  let service: ConvertTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
