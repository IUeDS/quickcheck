import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-numerical',
  templateUrl: './edit-numerical.component.html',
  styleUrls: ['./edit-numerical.component.scss']
})
export class EditNumericalComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    //when a new question is added, want to ensure validation is run immediately;
    //prevent a user from saving a new question without data added in.
    if (this.isInvalid()) {
      this.onEdited();
    }
  }

  addOption() {
    var tempId = (this.question.options.length + 1).toString() + '-temp';

    this.question.options.push({
      'id': tempId,
      'question_id': this.question.Id,
      'answer_type': 'exact',
      'numerical_answer': '',
      'margin_of_error': 0,
      'range_min': null,
      'range_max': null
    });

    this.onEdited();
    this.utilitiesService.focusToElement('#numerical-answer-' + this.question.id + '-' + tempId + '-type');
  }

  deleteOption($event) {
    const option = $event.option;
    const index = $event.index;

    //parent question component keeps track of all deleted options to pass to back-end
    if (option.id.toString().indexOf('temp') === -1) {
      this.onSavedOptionDeleted.emit({ option });
    }

    this.question.options.splice(index, 1);
    this.onEdited();
  }

  isExactAnswer(option) {
    if (option.answer_type === 'exact') {
      return true;
    }

    return false;
  }

  isInvalid() {
    if (this.question.options.length) {
      return false;
    }
    else {
      return 'No answer options were added to this question.';
    }
  }

  isRangeAnswer(option) {
    if (option.answer_type === 'range') {
      return true;
    }

    return false;
  }

  onEdited() {
    this.question.validationError = this.isInvalid();
    this.onQuestionEdited.emit({ question: this.question });
  }

  onSubComponentEdited($event) {
    this.question = $event.question;
    this.onEdited();
  }
}
