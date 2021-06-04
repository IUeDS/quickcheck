import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuestionAnalyticsComponent } from './question-analytics.component';

describe('QuestionAnalyticsComponent', () => {
  let component: QuestionAnalyticsComponent;
  let fixture: ComponentFixture<QuestionAnalyticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
