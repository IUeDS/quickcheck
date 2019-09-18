import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';

@Component({
  selector: 'qc-edit-multiple-correct',
  templateUrl: './edit-multiple-correct.component.html',
  styleUrls: ['./edit-multiple-correct.component.scss']
})
export class EditMultipleCorrectComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  isRichContentToggled = false;

  constructor(private editAssessmentConfig: EditAssessmentConfigService, private utilitiesService: UtilitiesService) { }

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
      'question_id': this.question.id,
      'answer_text': '',
      'correct': 'false'
    });

    this.onEdited();
    this.utilitiesService.focusToElement('#mc-option-' + this.question.id + '-' + tempId);
  }

  deleteOption($event) {
    var option = $event.option,
      index = $event.index;

    //parent question component keeps track of all deleted options to pass to back-end
    if (option.id.toString().indexOf('temp') === -1) {
      this.onSavedOptionDeleted.emit({ option: option });
    }

    this.question.options.splice(index, 1);
    this.onEdited();
  }

  isInvalid() {
    var optionsAdded = false,
      correctAnswerFound = false;

    if (this.question.options.length) {
      optionsAdded = true;
    }

    //check that a correct answer is marked
    this.question.options.forEach(function(option) {
      if (option.correct == 'true') {
        correctAnswerFound = true;
      }
    });

    if (optionsAdded && correctAnswerFound) {
      return false;
    }

    if (!optionsAdded) {
      return 'No answer options were added to this question.';
    }

    if (!correctAnswerFound) {
      return 'A correct answer has not been marked.';
    }
  }

  onEdited() {
    this.question.validationError = this.isInvalid();
    this.onQuestionEdited.emit({ question: this.question });
  }

  onRichContentToggle($event) {
    this.isRichContentToggled = $event.isToggled;
  }

  onSubComponentEdited($event) {
    this.question = $event.question;
    this.onEdited();
  }

  toggleCorrect($event) {
    var option = $event.option;

    if (this.readOnly) {
      return;
    }

    if (option.correct == 'false') {
      option.correct = 'true';
    }
    else {
      option.correct = 'false';
    }

    this.onEdited();
  }

}
