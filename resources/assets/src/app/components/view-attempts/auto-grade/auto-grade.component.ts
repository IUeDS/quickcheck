import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-auto-grade',
  templateUrl: './auto-grade.component.html',
  styleUrls: ['./auto-grade.component.scss']
})
export class AutoGradeComponent implements OnInit {
  @Input() pointsPossible;
  @Input() submissions;
  @Input() ungradedAttempts;
  @Input() utilitiesService;
  @Output() onSuccess = new EventEmitter();

  error = false;
  graded = false;
  loading = false;
  paginationSize = 50;
  success = false;
  successfulSubmissions = [];
  ungradedAssessment = false;

  constructor(private manageService: ManageService) { }

  ngOnInit() {
  }

}
