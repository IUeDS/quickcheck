import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAssessmentAttemptsComponent } from './student-assessment-attempts.component';

describe('StudentAssessmentAttemptsComponent', () => {
  let component: StudentAssessmentAttemptsComponent;
  let fixture: ComponentFixture<StudentAssessmentAttemptsComponent>;

  beforeEach(async(() => {
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
