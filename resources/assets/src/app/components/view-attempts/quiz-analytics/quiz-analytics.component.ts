import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-quiz-analytics',
  templateUrl: './quiz-analytics.component.html',
  styleUrls: ['./quiz-analytics.component.scss']
})
export class QuizAnalyticsComponent implements OnInit {
  analytics = null;

  constructor() { }

  ngOnInit() {
  }

}
