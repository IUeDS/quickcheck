import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFeedbackComponent } from './custom-feedback.component';

describe('CustomFeedbackComponent', () => {
  let component: CustomFeedbackComponent;
  let fixture: ComponentFixture<CustomFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
