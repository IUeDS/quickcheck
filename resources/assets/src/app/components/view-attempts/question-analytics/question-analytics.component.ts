import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';

@Component({
  selector: 'qc-question-analytics',
  templateUrl: './question-analytics.component.html',
  styleUrls: ['./question-analytics.component.scss']
})
export class QuestionAnalyticsComponent implements OnInit {
  @Input() question;

  correctPercentage = 0;
  fullBarWidth = 500;

  constructor(public utilitiesService: UtilitiesService, public editAssessmentConfigService: EditAssessmentConfigService) { }

  ngOnInit() {
    this.correctPercentage = this.question.questionAnalytics.correctPercentage;
    this.utilitiesService.formatMath(); //if equations present, format LaTeX

    const questionTypes = this.editAssessmentConfigService.getQuestionTypes();
    if (this.question.question_type === questionTypes.dragAndDrop.constantName) {
      this.initDragAndDropOptions(this.question);
    }
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

  initDragAndDropOptions(question) {
    question.droppables = [];
    question.draggables = [];

    for (let [key, option] of Object.entries(question.options)) {
      if (option['type'] === 'IMAGE') {
        question.image = option;
      }

      if (option['type'] === 'DROPPABLE') {
        option['disabled'] = false;
        option['entered'] = false;
        option['DRAGGABLE'] = [];
        question.droppables.push(option);
      }

      if (option['type'] === 'DRAGGABLE') {
        option['disabled'] = false;
        option['DROPPABLE'] = null;
        question.draggables.push(option);
      }
    }
  }

  isDraggedImg(droppable) {
    if (droppable.img_url) {
      return true;
    }

    return false;
  }

  isDraggedText(droppable) {
    if (droppable.text) {
      return true;
    }

    return false;
  }
}
