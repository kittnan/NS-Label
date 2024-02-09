import { TestBed } from '@angular/core/testing';

import { GenerateLabelService } from './generate-label.service';

describe('GenerateLabelService', () => {
  let service: GenerateLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
