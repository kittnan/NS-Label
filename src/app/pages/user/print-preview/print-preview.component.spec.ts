import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPreviewComponent } from './print-preview.component';

describe('PrintPreviewComponent', () => {
  let component: PrintPreviewComponent;
  let fixture: ComponentFixture<PrintPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPreviewComponent]
    });
    fixture = TestBed.createComponent(PrintPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
