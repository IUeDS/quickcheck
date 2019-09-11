import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { AssessmentService } from '../../services/assessment.service';
import { CaliperService } from '../../services/caliper.service';

@Component({
  selector: 'qc-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
  answerSelected = false;
  assessmentId = '';
  assessmentTitle = null;
  assessmentDescription = null;
  attemptId = false;
  caliper = null;
  complete = false;
  countCorrect = 0;
  countIncorrect = 0;
  currentQuestion = null;
  currentQuestionIndex = 0;
  errorMessage = false;
  feedback = [];
  incorrectRows = null; //matrix and matching only
  isCorrect = false;
  isNextBtnDisabled = false; //have to be careful to prevent double clicking next btn
  modalVisible = false; //for accessibility purposes, hide main when modal is visible
  questions = null;
  partialCredit = false;
  pointsPossible = 0;
  preview = false; //if preview query param in URL, send to server, valid LTI session not needed
  score = 0;
  studentAnswer = null;
  timeoutSecondsRemaining = null; //seconds of timeout remaining, if feature enabled

  constructor(private utilitiesService: UtilitiesService, private assessmentService: AssessmentService, private caliperService: CaliperService) { }

  ngOnInit() {
  }

}
