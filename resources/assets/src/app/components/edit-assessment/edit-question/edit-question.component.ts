import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'qc-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {
  @Input() question;
  @Input() questionIndex;
  @Input() readOnly;
  @Input() totalQuestionCount;
  @Input() utilitiesService;
  @Input() dragAndDropEnabled;
  @Output() onDelete = new EventEmitter();
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onQuestionReordered = new EventEmitter();

  questionTypes;
  tinymceOptions;

  constructor(private editAssessmentConfig: EditAssessmentConfigService, private httpService: HttpService) {
    this.questionTypes = editAssessmentConfig.getQuestionTypes();
    this.tinymceOptions = editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
    if (this.isNewQuestion()) {
      this.initializeNewQuestion();
    }

    //tiny mce setup to get app CSS applied to question text
    var fonts = 'https://fonts.googleapis.com/css?family=Open+Sans:400%2C400italic%2C700|Oswald:400%2C300|Holtwood+One+SC|Ultra,',
      cssFilePath = this.getCSSFilePath();

    this.tinymceOptions.content_css = fonts + cssFilePath;
  }

  ngOnChanges(changesObj) {
    if (changesObj.question) {
      this.question = changesObj.question.currentValue;
    }
  }

  deleteQuestion($event) {
    $event.stopPropagation(); //prevent accordion from being activated

    if (!this.isDeleteConfirmed()) {
      return false;
    }

    this.onDelete.emit({ questionIndex: this.questionIndex });
  }

  getCSSFilePath() {
    return '/assets/dist/styles.css';
  }

  initializeNewQuestion() {
    //set question type to multiple choice as a default;
    //the edit multiple choice component will initialize
    //4 options automatically when a question is added.
    this.question.question_type = this.questionTypes.multipleChoice.constantName;
  }

  isAllowedQuestionType(questionConstantName) {
    const dragAndDrop = this.questionTypes.dragAndDrop.constantName;
    if (questionConstantName != dragAndDrop) {
      return true;
    }

    if (this.dragAndDropEnabled) {
      return true;
    }

    return false;
  }

  isDeleteConfirmed() {
    //js alerts cause Protractor to freak out, so don't confirm in reg environment
    if (this.utilitiesService.isRegressionEnv()) {
      return true;
    }

    return window.confirm('Do you really want to delete this question?');
  }

  isFirstQuestion() {
    if (this.question.question_order == 1) {
      return true;
    }

    return false;
  }

  isLastQuestion() {
    if (this.question.question_order == this.totalQuestionCount) {
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

  isQuestionType(questionType) {
    if (this.question.question_type === this.questionTypes[questionType].constantName) {
      return true;
    }

    return false;
  }

  onEdited() {
    this.onQuestionEdited.emit({
      question: this.question,
      questionIndex: this.questionIndex
    });
  }

  onQuestionTypeChanged(newValue, oldValue) {
    var multipleChoice = this.questionTypes.multipleChoice.constantName,
      multipleCorrect = this.questionTypes.multipleCorrect.constantName,
      wasMc = oldValue === multipleChoice || oldValue === multipleCorrect ? true : false,
      isMc = newValue === multipleChoice || newValue === multipleCorrect ? true : false;

    this.onEdited();

    //if converting between multiple choice and multiple correct, proceed -- not a problem
    if (wasMc && isMc) {
      return;
    }

    //TODO: need to find a way to figure out if user has previously entered text, and if so,
    //give them a confirm() message letting them know that data will be erased
    this.resetOptions();
  }

  //put all deleted options in an array for back-end to remove
  onSavedOptionDeleted($event) {
    const option = $event.option;
    if (!this.question.deletedOptions) {
      this.question.deletedOptions = [];
    }

    this.question.deletedOptions.push(option);
  }

  onSubComponentEdited($event) {
    this.question = $event.question;
    this.onEdited();
  }

  reorderQuestionDown($event) {
    $event.stopPropagation(); //prevent accordion from being activated

    var eventData = {
      newQuestionIndex: this.questionIndex + 1,
      questionIndex: this.questionIndex
    };

    this.onQuestionReordered.emit(eventData);
  }

  reorderQuestionUp($event) {
    $event.stopPropagation(); //prevent accordion from being activated

    const eventData = {
      newQuestionIndex: this.questionIndex - 1,
      questionIndex: this.questionIndex
    };

    this.onQuestionReordered.emit(eventData);
  }

  //when changing between question types, reset the options so the data doesn't get garbled
  resetOptions() {
    this.question.options = [];
  }

  toggleQuestionClosed() {
    //else clause is necessary here in case closed attr not yet set;
    //this is a front-end construction rather than saved on back-end,
    //so it is not initially set when data sent from back-end on load.
    if (this.question.questionClosed) {
      this.question.questionClosed = false;
    }
    else {
      this.question.questionClosed = true;
    }
  }
}
