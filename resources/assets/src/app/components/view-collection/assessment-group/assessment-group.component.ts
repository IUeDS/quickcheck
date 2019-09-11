import { Component, OnInit } from '@angular/core';
import { AssessmentEditService } from '../../../services/assessment-edit.service';
import { CollectionService } from '../../../services/collection.service';
import { HttpService } from '../../../services/http.service';

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

  constructor(
    private httpService: HttpService,
    private collectionService: CollectionService,
    private assessmentEditService: AssessmentEditService
  ) { }

  ngOnInit() {
  }

}
