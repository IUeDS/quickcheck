import { Component, OnInit, Input } from '@angular/core';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-student-assessment-attempts',
  templateUrl: './student-assessment-attempts.component.html',
  styleUrls: ['./student-assessment-attempts.component.scss']
})
export class StudentAssessmentAttemptsComponent implements OnInit {
  @Input('assessmentWithAttempts') assessment;
  @Input() courseContext;
  @Input() studentId;
  @Input() user;
  @Input() utilitiesService;

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

  constructor(private manageService: ManageService) { }

  ngOnInit() {
  }

}
