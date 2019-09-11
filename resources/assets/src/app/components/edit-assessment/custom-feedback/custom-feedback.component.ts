import { Component, OnInit } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';

@Component({
  selector: 'qc-custom-feedback',
  templateUrl: './custom-feedback.component.html',
  styleUrls: ['./custom-feedback.component.scss']
})
export class CustomFeedbackComponent implements OnInit {

  isRichContentToggled = false;
  perResponseFeedback = false;
  tinymceOptions = {};

  constructor(private editAssessmentConfig: EditAssessmentConfigService) {
    this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
  }

}
