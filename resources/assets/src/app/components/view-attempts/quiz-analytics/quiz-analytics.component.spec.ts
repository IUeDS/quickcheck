import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuizAnalyticsComponent } from './quiz-analytics.component';

describe('QuizAnalyticsComponent', () => {
  let component: QuizAnalyticsComponent;
  let fixture: ComponentFixture<QuizAnalyticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
