import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qc-add-assessment-group',
  templateUrl: './add-assessment-group.component.html',
  styleUrls: ['./add-assessment-group.component.scss']
})
export class AddAssessmentGroupComponent implements OnInit {

  formOpen = false;
  newAssessmentGroup = null;

  constructor() { }

  ngOnInit() {
  }

}
