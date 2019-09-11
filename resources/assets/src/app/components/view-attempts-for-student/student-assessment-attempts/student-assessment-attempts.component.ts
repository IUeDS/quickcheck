import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-student-assessment-attempts',
  templateUrl: './student-assessment-attempts.component.html',
  styleUrls: ['./student-assessment-attempts.component.scss']
})
export class StudentAssessmentAttemptsComponent implements OnInit {

  attempts = [];
  accordionClosed = true;
  dueAt = false;
  gradesLoading = true;
  pointsPossible = null;
  questions = [];
  responseAttempt = null;
  responseViewVisible = false;
  studentResponses = [];
  submission = null;
  timezone = null;

  constructor() { }

  ngOnInit() {
  }

}
