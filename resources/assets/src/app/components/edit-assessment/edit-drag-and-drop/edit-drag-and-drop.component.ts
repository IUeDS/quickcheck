import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { fabric } from 'fabric'; 

@Component({
  selector: 'qc-edit-drag-and-drop',
  templateUrl: './edit-drag-and-drop.component.html',
  styleUrls: ['./edit-drag-and-drop.component.scss']
})
export class EditDragAndDropComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  tinymceOptions;

  constructor(private editAssessmentConfig: EditAssessmentConfigService, public utilitiesService: UtilitiesService) { 
    this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit(): void {
    
  }

  isInvalid() {
    return false;
  }

  onEdited() {
    this.question.validationError = this.isInvalid();
    this.onQuestionEdited.emit({question: this.question});
  }

  onSubComponentEdited($event) {
    this.question = $event.question;
    this.onEdited();
  }

}
