import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';

@Component({
  selector: 'qc-toggle-correct-btn',
  templateUrl: './toggle-correct-btn.component.html',
  styleUrls: ['./toggle-correct-btn.component.scss']
})
export class ToggleCorrectBtnComponent implements OnInit {
  @Input() index;
  @Input() option;
  @Input() question;
  @Output() onToggleCorrect = new EventEmitter();

  questionTypes;

  constructor(private editAssessmentConfig: EditAssessmentConfigService) {
    this.questionTypes = editAssessmentConfig.getQuestionTypes();
  }

  ngOnInit() {
  }

  isCorrect() {
    if (this.option.correct == 'true') {
      return true;
    }

    return false;
  }

  isMultipleChoice() {
    if (this.question.question_type === this.questionTypes.multipleChoice.constantName) {
      return true;
    }

    return false;
  }

  isMultipleCorrect() {
    if (this.question.question_type === this.questionTypes.multipleCorrect.constantName) {
      return true;
    }

    return false;
  }

  toggleCorrect() {
    this.onToggleCorrect.emit({option: this.option});
  }
}
