import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'qc-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {
  @Input() question;
  @Input() questionIndex;
  @Input() readOnly;
  @Input() totalQuestionCount;
  @Input() utilitiesService;
  @Output() onDelete = new EventEmitter();
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onQuestionReordered = new EventEmitter();

  questionTypes = {};
  tinymceOptions = {};

  constructor(private editAssessmentConfig: EditAssessmentConfigService, private httpService: HttpService) {
    this.questionTypes = editAssessmentConfig.getQuestionTypes();
    this.tinymceOptions = editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit() {
  }

}
