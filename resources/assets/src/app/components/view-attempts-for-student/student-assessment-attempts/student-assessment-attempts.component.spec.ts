import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentAssessmentAttemptsComponent } from './student-assessment-attempts.component';

describe('StudentAssessmentAttemptsComponent', () => {
  let component: StudentAssessmentAttemptsComponent;
  let fixture: ComponentFixture<StudentAssessmentAttemptsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAssessmentAttemptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAssessmentAttemptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
