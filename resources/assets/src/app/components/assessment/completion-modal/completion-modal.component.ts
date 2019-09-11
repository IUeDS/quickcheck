import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { AssessmentService } from '../../../services/assessment.service';

@Component({
  selector: 'qc-completion-modal',
  templateUrl: './completion-modal.component.html',
  styleUrls: ['./completion-modal.component.scss']
})
export class CompletionModalComponent implements OnInit {
  error = false;
  graded = false;
  isInModule = false;
  loading = false;

  constructor(private utilitiesService: UtilitiesService, private assessmentService: AssessmentService) { }

  ngOnInit() {
  }

}
