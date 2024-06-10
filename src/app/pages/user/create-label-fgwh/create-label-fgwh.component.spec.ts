import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLabelFgwhComponent } from './create-label-fgwh.component';

describe('CreateLabelFgwhComponent', () => {
  let component: CreateLabelFgwhComponent;
  let fixture: ComponentFixture<CreateLabelFgwhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLabelFgwhComponent]
    });
    fixture = TestBed.createComponent(CreateLabelFgwhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
