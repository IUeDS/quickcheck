import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowFeedbackComponent } from './row-feedback.component';

describe('RowFeedbackComponent', () => {
  let component: RowFeedbackComponent;
  let fixture: ComponentFixture<RowFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
