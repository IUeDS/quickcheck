import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';
import { ManageService } from '../../services/manage.service';
import { Submission } from '../../classes/submission';

@Component({
  selector: 'qc-view-attempts',
  templateUrl: './view-attempts.component.html',
  styleUrls: ['./view-attempts.component.scss']
})
export class ViewAttemptsComponent implements OnInit {

  assessment = null;
  assessmentId = '';
  assignment = null;
  attempts = []; //all attempts
  canvasCourse = null;
  courseContext = null;
  currentPage = 'results';
  displayedAttempts = []; //those shown to user (after filters, etc.)
  dueAt = null;
  gradesLoading = true;
  largeClassSize = false;
  pointsPossible = 0;
  questions = [];
  release = false;
  responseAttempt = null;
  responseViewVisible = false;
  search = { 'studentLastName': '' }; //for searching through students
  showUngradedOnly = false;
  studentResponses = [];
  submissions = [];
  ungradedAttempts = [];
  users = [];

  constructor(private utilitiesService: UtilitiesService, private manageService: ManageService) { }

  ngOnInit() {
  }

}
