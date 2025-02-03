import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapCreateLabelComponent } from './sap-create-label.component';

describe('SapCreateLabelComponent', () => {
  let component: SapCreateLabelComponent;
  let fixture: ComponentFixture<SapCreateLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SapCreateLabelComponent]
    });
    fixture = TestBed.createComponent(SapCreateLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
