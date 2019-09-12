import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';

@Component({
  selector: 'qc-edit-multiple-correct',
  templateUrl: './edit-multiple-correct.component.html',
  styleUrls: ['./edit-multiple-correct.component.scss']
})
export class EditMultipleCorrectComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  constructor(private editAssessmentConfig: EditAssessmentConfigService, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
