import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-custom-feedback',
  templateUrl: './custom-feedback.component.html',
  styleUrls: ['./custom-feedback.component.scss']
})
export class CustomFeedbackComponent implements OnInit {
  @Input() question;
  @Output() onQuestionEdited = new EventEmitter();

  isRichContentToggled = false;
  perResponseFeedback = false;
  tinymceOptions = {};

  constructor(private editAssessmentConfig: EditAssessmentConfigService, private utilitiesService: UtilitiesService) {
    this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
  }

}
