import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-view-attempts-for-student',
  templateUrl: './view-attempts-for-student.component.html',
  styleUrls: ['./view-attempts-for-student.component.scss']
})
export class ViewAttemptsForStudentComponent implements OnInit {

  analyticsViewVisible = false;
  assessmentsWithAttempts = [];
  courseContext = null;
  currentPage = 'results';
  displayedAssessments = []; //those shown to user (after filters, etc.)
  studentId = null;
  studentName = null;
  user = null;

  constructor() { }

  ngOnInit() {
  }

}
