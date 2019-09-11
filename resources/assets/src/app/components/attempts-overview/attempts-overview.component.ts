import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-attempts-overview',
  templateUrl: './attempts-overview.component.html',
  styleUrls: ['./attempts-overview.component.scss']
})
export class AttemptsOverviewComponent implements OnInit {
  attempts = [];
  currentPage = 'results';
  isResultsByStudentToggled = false;
  sessionStorageKey = 'iu-eds-quickcheck-student-results-toggle';
  search = {
      'assessmentName': '',
      'studentName': ''
  };
  students = [];

  constructor() { }

  ngOnInit() {
  }

}
