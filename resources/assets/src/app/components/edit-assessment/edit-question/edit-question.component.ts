import { Component, OnInit } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';

@Component({
  selector: 'qc-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {
  questionTypes = {};
  tinymceOptions = {};

  constructor(private editAssessmentConfig: EditAssessmentConfigService) {
    this.questionTypes = editAssessmentConfig.getQuestionTypes();
    this.tinymceOptions = editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
  }

}
