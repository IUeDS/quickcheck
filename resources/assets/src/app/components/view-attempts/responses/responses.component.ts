import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'qc-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {
  @Input('attempt') attemptData;
  @Input() courseContext;
  @Input('responses') studentResponsesData;
  @Input('questions') questionsData;
  @Input('isStudent') isStudentData;

  attempt;
  studentResponses;
  questions;
  isStudent;
  showTableView = false;
  correctIconClass = 'fa-long-arrow-right'; //so we can easily swap out the correct icon

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    //copy the passed in data so changes we make within this component
    //to parse/format the data do not hold over; oddly, since the
    //component is reused, data from one student can sometimes hold
    //over to the next student, even when the component is re-initialized.
    //seems to be an angular quirk.
    this.attempt = cloneDeep(this.attemptData);
    this.studentResponses = cloneDeep(this.studentResponsesData);
    this.questions = cloneDeep(this.questionsData);
    console.log(this.questions);
    console.log(this.studentResponses);
    this.isStudent = cloneDeep(this.isStudentData);

    this.parseResponseData();
    this.getScoreOutof100();
    this.utilitiesService.formatMath(); //if equations present, format LaTeX
    this.utilitiesService.setLtiHeight();
  }

  //some custom activities use a range of 0-1 rather than 0-100
  getScoreOutof100() {
    var score = this.attempt.calculated_score;
    this.attempt.score = score <= 1 ? score * 100 : score;
  }

  parseResponseData() {
    //first, check to see if this is either a custom activity (table view) or quick check (response view)
    //custom activity
    if (this.studentResponses[0].custom_responses.length) {
      this.showTableView = true;
      return;
    }
    //quick check
    for (let [index, studentResponse] of this.studentResponses.entries()) {
      if (!this.markCorrectandIncorrectResponses(studentResponse)) {
        //if no response match found and we can't mark it up, display error
        this.questions[index].error = true;
      }
    }
  }

  markCorrectandIncorrectResponses(studentResponse) {
    var answerFound = false;

    //make isCorrect a little cleaner, in boolean form, for cleaner conditionals
    if (studentResponse.is_correct == '1') {
      studentResponse.isCorrect = true;
    }
    else {
      studentResponse.isCorrect = false;
    }

    //we can't fetch the question until we dive into the internals of student responses;
    //we can't rely on question order if a quiz is shuffled;
    //therefore, in each one of these, we need to loop through questions/options to get a match;
    //sure, there are more efficient solutions, but we are guaranteed a small dataset here,
    //since this is one student's responses to one quiz, so not worth the effort of optimizing
    //TODO: regardless, I would like to refactor and clean up the logic
    if (studentResponse.mc_responses.length) {
      answerFound = this.markMCResponses(studentResponse);
    }
    else if (studentResponse.textmatch_responses.length) {
      answerFound = this.markTextmatchResponse(studentResponse);
    }
    else if (studentResponse.numerical_responses.length) {
      answerFound = this.markNumericalResponse(studentResponse);
    }
    else if (studentResponse.matrix_responses.length) {
      answerFound = this.markMatrixResponses(studentResponse);
    }
    else if (studentResponse.matching_responses.length) {
      answerFound = this.markMatchingResponses(studentResponse);
    }
    else if (studentResponse.dropdown_responses.length) {
      answerFound = this.markDropdownResponses(studentResponse);
    }

    return answerFound;
  }

  markMCResponses(studentResponse) {
    var answerFound = false;

    //TODO: there's gotta be a cleaner way to do this...
    for (let mcOption of studentResponse.mc_responses) {
      for (let question of this.questions) {
        const questionType = question.question_type;
        if (questionType === 'multiple_choice' || questionType === 'multiple_correct') {
          for (let option of question.options) {
            if (option.id == mcOption.mc_answer_id) {
              option.studentAnswer = true;
              answerFound = true;
              question.studentResponse = studentResponse;
            }
          }
        }
      }
    }

    return answerFound;
  }

  markTextmatchResponse(studentResponse) {
    var answerFound = false;

    for (let question of this.questions) {
      if (question.question_type === 'textmatch') {
        if (question.id == studentResponse.textmatch_responses[0].question_id) {
          answerFound = true;
          question.studentResponse = studentResponse;
          question.studentAnswer = studentResponse.textmatch_responses[0].student_answer_text;
        }
      }
    }

    return answerFound;
  }

  markNumericalResponse(studentResponse) {
    var answerFound = false;

    for (let question of this.questions)  {
      if (question.question_type === 'numerical') {
        if (question.id == studentResponse.numerical_responses[0].question_id) {
          answerFound = true;
          question.studentResponse = studentResponse;
          question.studentAnswer = studentResponse.numerical_responses[0].student_answer_value;
        }
      }
    }

    return answerFound;
  }

  markMatrixResponses(studentResponse) {
    var answerFound = false,
      matchesFound = 0,
      numRows = 0,
      col,
      row,
      question;

    for (let thisQuestion of this.questions)  {
      if (thisQuestion.question_type === 'matrix') {
        for (let option of thisQuestion.options) {
          if (option.id == studentResponse.matrix_responses[0].matrix_row_id) {
            question = thisQuestion;
            question.studentResponse = studentResponse;
          }
        }
      }
    }

    //if we couldn't find the question
    if (!question) {
      return false;
    }

    //first, get the number of rows, so we can ensure that all answers are marked
    for (let option of question.options) {
      if (option.row_or_column === 'row') {
        numRows++;
      }
    }

    //next, match student responses in each row to their corresponding column
    for (let matrixResponse of studentResponse.matrix_responses) {
      col = false;
      row = false;

      for (let option of question.options) {
        if (matrixResponse.matrix_row_id == option.id) {
          row = option;
        }
        if (matrixResponse.matrix_column_id == option.id) {
          col = option;
        }
      }

      if (col && row) {
        matchesFound++;
        row.studentAnswer = col;
      }
    }

    if (matchesFound === numRows) {
      answerFound = true;
    }
    this.initMatrixOptions(question);

    return answerFound;
  }

  markMatchingResponses(studentResponse) {
    var answerFound = false,
      matchesFound = 0,
      numPrompts = 0,
      prompt,
      answer = false,
      question;

    for (let thisQuestion of this.questions) {
      if (thisQuestion.question_type === 'matching') {
        for (let option of thisQuestion.options) {
          if (option.id == studentResponse.matching_responses[0].matching_prompt_id) {
            question = thisQuestion;
            question.studentResponse = studentResponse;
          }
        }
      }
    }

    //if we couldn't find the question
    if (!question) {
      return false;
    }

    //first, get the number of prompts, so we can ensure that all answers are marked
    for (let option of question.options) {
      if (option.prompt_or_answer === 'prompt') {
        numPrompts++;
      }
    }

    //next, match student responses in each prompt to their corresponding answer
    for (let matchingResponse of studentResponse.matching_responses) {
      prompt = false;
      answer = false;

      for (let option of question.options) {
        if (matchingResponse.matching_prompt_id == option.id) {
          prompt = option;
        }
        if (matchingResponse.matching_answer_id == option.id) {
          answer = option;
        }
      }

      if (prompt && answer) {
        matchesFound++;
        prompt.studentAnswer = answer;
      }
    }

    if (matchesFound === numPrompts) {
      answerFound = true;
    }
    this.initMatchingOrDropdownOptions(question);

    return answerFound;
  }

  markDropdownResponses(studentResponse) {
    var answerFound = false,
      matchesFound = 0,
      numPrompts = 0,
      prompt,
      answer = false,
      question;

    for (let thisQuestion of this.questions) {
      if (thisQuestion.question_type === 'dropdown') {
        for (let option of thisQuestion.options) {
          if (option.id == studentResponse.dropdown_responses[0].dropdown_prompt_id) {
            question = thisQuestion;
            question.studentResponse = studentResponse;
          }
        }
      }
    }

    //if we couldn't find the question
    if (!question) {
      return false;
    }

    //first, get the number of prompts, so we can ensure that all answers are marked
    for (let option of question.options) {
      if (option.prompt_or_answer === 'prompt') {
        numPrompts++;
      }
    }

    //next, match student responses in each prompt to their corresponding answer
    for (let dropdownResponse of studentResponse.dropdown_responses) {
      prompt = false;
      answer = false;

      for (let option of question.options) {
        if (dropdownResponse.dropdown_prompt_id == option.id) {
          prompt = option;
        }
        if (dropdownResponse.dropdown_answer_id == option.id) {
          answer = option;
        }
      }

      if (prompt && answer) {
        matchesFound++;
        prompt.studentAnswer = answer;
      }
    }

    if (matchesFound === numPrompts) {
      answerFound = true;
    }
    this.initMatchingOrDropdownOptions(question);

    return answerFound;
  }

  isMatrixAnswerCorrect(row, column) {
    return row.matrix_answer_text == column.answer_text ? true : false;
  }

  initMatrixOptions(question) {
    question.columns = [];
    question.rows = [];

    for (let qOption of question.options) {
      if (qOption.row_or_column == 'row') {
        question.rows.push(qOption);
      }
      else {
        question.columns.push(qOption);
      }
    }
  }

  initMatchingOrDropdownOptions(question) {
    question.prompts = [];
    question.selectableAnswers = [];

    for (let qOption of question.options) {
      if (qOption.prompt_or_answer == 'prompt') {
        question.prompts.push(qOption);
      }
      else {
        question.selectableAnswers.push(qOption);
      }
    }
  }

  //custom activities send count correct to the back-end, but quizzes calculate based on responses
  getCountCorrect(attempt) {
    if (attempt.count_correct !== null) {
      return attempt.count_correct;
    }

    var countCorrect = 0;
    for (let response of this.studentResponses) {
      if (response.is_correct == '1') {
        countCorrect++;
      }
    }

    return countCorrect;
  }

  //custom activities send count correct to the back-end, but quizzes calculate based on responses
  getCountIncorrect(attempt) {
    if (attempt.count_incorrect !== null) {
      return attempt.count_incorrect;
    }

    var countIncorrect = 0;
    for (let response of this.studentResponses) {
      if (response.is_correct == '0') {
        countIncorrect++;
      }
    }

    return countIncorrect;
  }
}
