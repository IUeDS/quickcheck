import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-student-analytics',
  templateUrl: './student-analytics.component.html',
  styleUrls: ['./student-analytics.component.scss']
})
export class StudentAnalyticsComponent implements OnInit {

  averageRetries = 0;
  averageScore = 0;
  averageTime = 0;
  averageTimeBeforeDueDate = 0;
  averageTimeAfterDueDate = 0;
  averageTimeUntilDueDate = 0;
  totalAttempts = 0;
  totalQuestions = 0;
  totalTime = 0;
  totalTimeBeforeDueDate = 0;
  totalTimeAfterDueDate = 0;

  constructor() { }

  ngOnInit() {
  }

}
