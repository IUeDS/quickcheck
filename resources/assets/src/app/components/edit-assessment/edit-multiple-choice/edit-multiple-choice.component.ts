import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-edit-multiple-choice',
  templateUrl: './edit-multiple-choice.component.html',
  styleUrls: ['./edit-multiple-choice.component.scss']
})
export class EditMultipleChoiceComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  defaultOptionCount = 4;
  isRichContentToggled = false;
  tinymceOptions = {};

  constructor(private editAssessmentConfig: EditAssessmentConfigService, private utilitiesService: UtilitiesService) {
    this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
  }

}
