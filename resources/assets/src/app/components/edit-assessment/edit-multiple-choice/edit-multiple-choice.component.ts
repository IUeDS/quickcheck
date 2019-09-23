import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-multiple-choice',
  templateUrl: './edit-multiple-choice.component.html',
  styleUrls: ['./edit-multiple-choice.component.scss']
})
export class EditMultipleChoiceComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  defaultOptionCount = 4;
  isRichContentToggled = false;
  tinymceOptions;

  constructor(private editAssessmentConfig: EditAssessmentConfigService, public utilitiesService: UtilitiesService) {
    this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
    if (this.isNewQuestion()) {
      this.initializeNewQuestion();
    }
  }

  addOption(noFocus) {
    var tempId = (this.question.options.length + 1).toString() + '-temp';

    this.question.options.push({
      'id': tempId,
      'question_id': this.question.id,
      'answer_text': '',
      'correct': 'false'
    });

    this.onEdited();

    if (noFocus) { //when initializing new question, don't steal focus
      return;
    }

    this.utilitiesService.focusToElement('#mc-option-' + this.question.id + '-' + tempId);
  }

  deleteOption($event) {
    var option = $event.option,
      index = $event.index;

    //parent question component keeps track of all deleted options to pass to back-end
    if (option.id.toString().indexOf('temp') === -1) {
      this.onSavedOptionDeleted.emit({ option });
    }

    this.question.options.splice(index, 1);
    this.onEdited();
  }

  initializeNewQuestion() {
    var noFocus = true; //don't hog focus from beginning of question

    //ensure we don't accidentally double-dip; can happen if reordering new question
    if (this.question.options.length) {
      return;
    }

    for (let i = 0; i < this.defaultOptionCount; i++) {
      this.addOption(noFocus);
    }
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

  isMultipleCorrect() {
    if (this.question.multiple_correct == 1) {
      return true;
    }

    return false;
  }

  isNewQuestion() {
    //if integer ID from database, not new
    if (typeof this.question.id !== 'string') {
      return false;
    }

    if (this.question.id.indexOf('temp') >= 0) {
      return true;
    }

    return false;
  }

  onEdited() {
    this.question.validationError = this.isInvalid();
    this.onQuestionEdited.emit({question: this.question});
  }

  onRichContentToggle($event) {
    this.isRichContentToggled = $event.isToggled;
  }

  onSubComponentEdited($event) {
    this.question = $event.question;
    this.onEdited();
  }

  toggleCorrect($event) {
    //can't add ng-disabled since this isn't technically a button element
    if (this.readOnly) {
      return false;
    }

    var option = $event.option; //retrieved from sub-component event

    //by default, only one correct answer for multiple choice; however, if the checkbox for
    //multiple_correct is checked, then although the question will appear as multiple choice,
    //students can get credit for several different answers (i.e., survey-style question)
    if (this.isMultipleCorrect()) {
      this.toggleCorrectValue(option);
    }
    else {
      //if a typical multiple choice question, ensure that only the option being clicked
      //is marked as correct, and all other options are marked as incorrect
      this.question.options.forEach(function(thisOption) {
        if (thisOption.id !== option.id) {
          thisOption.correct = 'false';
        }
        else {
          thisOption.correct = 'true';
        }
      });
    }

    this.onEdited();
  }

  toggleCorrectValue(option) {
    if (option.correct == 'false') {
      option.correct = 'true';
    }
    else {
      option.correct = 'false';
    }
  }

  toggleMultipleCorrect() {
    if (this.question.multiple_correct == 1) {
      this.question.multiple_correct = 0;
    }
    else {
      this.question.multiple_correct = 1;
    }

    this.onEdited();
  }
}
