import { Component, OnInit } from '@angular/core';
import { AssessmentEditService } from '../../services/assessment-edit.service';
import { UserService } from '../../services/user.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'qc-edit-assessment',
  templateUrl: './edit-assessment.component.html',
  styleUrls: ['./edit-assessment.component.scss']
})
export class EditAssessmentComponent implements OnInit {
  admin = false;
  assessment = null;
  assessmentGroups = null;
  assessmentId = null;
  collection = null;
  currentPage = 'sets';
  customActivity = null;
  customActivityAdded = false;
  edited = false;
  questions = null;
  readOnly = false;
  saved = true;
  user = null;
  validationError = false; //if validation errors, show a warning
  validationErrorList = [];

  constructor(
    private utilitiesService: UtilitiesService,
    private userService: UserService,
    private assessmentEditService: AssessmentEditService
  ) { }

  ngOnInit() {
  }

}
