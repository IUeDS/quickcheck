import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-custom-feedback',
  templateUrl: './custom-feedback.component.html',
  styleUrls: ['./custom-feedback.component.scss']
})
export class CustomFeedbackComponent implements OnInit {
  @Input() question;
  @Output() onQuestionEdited = new EventEmitter();

  isRichContentToggled = false;
  perResponseFeedback = false;
  tinymceOptions = {};

  constructor(private editAssessmentConfig: EditAssessmentConfigService, public utilitiesService: UtilitiesService) {
  this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
    this.isPerResponseFeedbackAdded();
    if (!this.question.question_feedback) { //for a new question
      this.question.question_feedback = [];
    }
  }

  isCorrect(option) {
    if (option.correct == 'true') {
      return true;
    }

    return false;
  }

  isFeedbackPresent() {
    if (this.question.question_feedback.length || this.perResponseFeedback) {
      return true;
    }

    return false;
  }

  isPerResponseFeedbackAdded() {
    this.perResponseFeedback = false;

    //if a new question, might not have any options yet, so prevent an error being thrown
    if (!this.question.options) {
      return;
    }

    if (!this.question.options.length) {
      return;
    }

    //all options must have feedback added
    if (this.question.options[0].mc_option_feedback) {
      this.perResponseFeedback = true;
      this.utilitiesService.setLtiHeight();
    }
  }

  isPerResponseFeedbackAvailable() {
    var questionType = this.question.question_type;

    if (questionType === 'multiple_choice' || questionType === 'multiple_correct') {
      return true;
    }

    return false;
  }

  onEdited() {
    this.onQuestionEdited.emit({ question: this.question });
  }

  onRichContentToggle($event) {
    this.isRichContentToggled = $event.isToggled;
  }

  toggleCustomFeedback() {
    //if custom feedback has been added and needs to be removed
    if (this.perResponseFeedback) {
      this.toggleOptionFeedback();
    }
    //in all cases, toggle the question-level
    // --> if we remove per response feedback above, it automatically adds question-level back in,
    //     as a default, so we need to remove it to clear all custom feedback.
    // --> if the user is clicking the button add custom feedback, then add the default of question-level
    this.toggleQuestionLevelFeedback();
  }

  toggleQuestionLevelFeedback() {
    if (this.question.question_feedback.length) { //remove if present
      this.question.question_feedback = [];
    }
    else { //or add if not present
      //add correct/incorrect feedback by default
      this.question.question_feedback = [
        {
          'question_id' : this.question.id,
          'feedback_text' : '',
          'correct': 'true'
        },
        {
          'question_id' : this.question.id,
          'feedback_text' : '',
          'correct': 'false'
        }
      ];
    }
    this.onEdited();
    this.utilitiesService.setLtiHeight();
  }

  toggleOptionFeedback() {
    if (this.perResponseFeedback) { //delete
      this.perResponseFeedback = false;
      this.question.options.forEach(function(option) {
        delete option.mc_option_feedback;
      });
    }
    else { //add
      this.perResponseFeedback = true;
      this.question.options.forEach(function(option) {
        option.mc_option_feedback = {
          'mc_answer_id' : option.id,
          'feedback_text': null
        };
      });
    }
    //re-add or remove question-level correct/incorrect feedback, to prevent redundancies
    this.toggleQuestionLevelFeedback();
  }
}
