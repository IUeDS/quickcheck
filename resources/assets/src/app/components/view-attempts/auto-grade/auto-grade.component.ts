import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-auto-grade',
  templateUrl: './auto-grade.component.html',
  styleUrls: ['./auto-grade.component.scss']
})
export class AutoGradeComponent implements OnInit {

  error = false;
  graded = false;
  loading = false;
  paginationSize = 50;
  success = false;
  successfulSubmissions = [];
  ungradedAssessment = false;

  constructor() { }

  ngOnInit() {
  }

}
