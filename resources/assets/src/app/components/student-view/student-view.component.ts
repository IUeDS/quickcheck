import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'qc-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent implements OnInit {
  attemptAssessment = null;
  courseContext = null;
  displayedAttempts = [];
  questions = [];
  responses = [];
  responseAttempt = null;
  showResponses = false; //set by feature toggling on collection, by instructor preference
  view = 'releases';

  constructor(private utilitiesService: UtilitiesService, private manageService: ManageService) { }

  ngOnInit() {
  }

  //when going back from attempts view
  goBackToReleases() {
    this.view = 'releases';
    this.utilitiesService.setLtiHeight();
  }

  //when going back from the responses view
  goBackToAttempts() {
    this.view = 'attempts';
    this.utilitiesService.setLtiHeight();
  }

  isAttemptsView() {
    if (this.view === 'attempts') {
      return true;
    }

    return false;
  }

  //when clicking on an assessment off of the release list
  async viewAttempts($event) {
    var assessment = $event.assessment;
    this.attemptAssessment = assessment;
    this.view = 'attempts';
    this.utilitiesService.loadingStarted();
    let data;

    try {
      const resp = await this.manageService.getStudentAttempts(assessment.id, this.utilitiesService.contextId);
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.utilitiesService.showError(error);
      return;
    }

    this.displayedAttempts = data.attempts;
    this.showResponses = data.showResponses;
    this.questions = data.questions;
    this.courseContext = data.courseContext;
    this.utilitiesService.loadingFinished();
  }

  viewResponses($event) {
    var attempt = $event.attempt;
    this.responseAttempt = attempt;
    this.responses = attempt.student_responses;
    this.view = 'responses';
    this.utilitiesService.focusToElement('#response-header');
    this.utilitiesService.setLtiHeight();
  }
}
