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

}
