import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'qc-add-assessment-group',
  templateUrl: './add-assessment-group.component.html',
  styleUrls: ['./add-assessment-group.component.scss']
})
export class AddAssessmentGroupComponent implements OnInit {
  @Input() collectionId;
  @Input() utilitiesService;
  @Output() onSave = new EventEmitter();

  formOpen = false;
  newAssessmentGroup = null;

  constructor(private collectionService: CollectionService) { }

  ngOnInit() {
  }

}
