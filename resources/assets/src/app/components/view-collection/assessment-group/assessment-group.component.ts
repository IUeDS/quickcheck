import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-assessment-group',
  templateUrl: './assessment-group.component.html',
  styleUrls: ['./assessment-group.component.scss']
})
export class AssessmentGroupComponent implements OnInit {

  editingData = {};
  isAddingAssessment = null;
  isEditing = false;
  memberships = null;
  newAssessment = null;

  constructor() { }

  ngOnInit() {
  }

}
