import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-question-analytics',
  templateUrl: './question-analytics.component.html',
  styleUrls: ['./question-analytics.component.scss']
})
export class QuestionAnalyticsComponent implements OnInit {
  @Input() question;

  correctPercentage = 0;
  fullBarWidth = 500;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.correctPercentage = this.question.questionAnalytics.correctPercentage;
    this.utilitiesService.formatMath(); //if equations present, format LaTeX
  }

  getOtherResponsesPercentage(question) {
    var countOther = question.questionAnalytics.otherResponses.length,
      countAnswered = question.questionAnalytics.countAnswered;
    return Math.round(countOther / countAnswered * 100);
  }

  toggleResponses(question) {
    if (question.responsesVisible) {
      question.responsesVisible = false;
    }
    else {
      question.responsesVisible = true;
    }
  }
}
