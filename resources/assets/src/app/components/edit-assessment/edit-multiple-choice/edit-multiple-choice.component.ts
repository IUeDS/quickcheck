import { Component, OnInit } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';

@Component({
  selector: 'qc-edit-multiple-choice',
  templateUrl: './edit-multiple-choice.component.html',
  styleUrls: ['./edit-multiple-choice.component.scss']
})
export class EditMultipleChoiceComponent implements OnInit {
  defaultOptionCount = 4;
  isRichContentToggled = false;
  tinymceOptions = {};

  constructor(private editAssessmentConfig: EditAssessmentConfigService) {
    this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
  }

}
