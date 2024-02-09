import { TestBed } from '@angular/core/testing';

import { QrCodeAndBarcodeService } from './qr-code-and-barcode.service';

describe('QrCodeAndBarcodeService', () => {
  let service: QrCodeAndBarcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrCodeAndBarcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
