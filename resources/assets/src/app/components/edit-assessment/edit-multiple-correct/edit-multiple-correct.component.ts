import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';

@Component({
  selector: 'qc-edit-multiple-correct',
  templateUrl: './edit-multiple-correct.component.html',
  styleUrls: ['./edit-multiple-correct.component.scss']
})
export class EditMultipleCorrectComponent implements OnInit {

  constructor(private editAssessmentConfig: EditAssessmentConfigService, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
