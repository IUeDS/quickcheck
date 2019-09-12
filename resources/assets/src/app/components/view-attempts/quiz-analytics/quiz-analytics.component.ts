import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-quiz-analytics',
  templateUrl: './quiz-analytics.component.html',
  styleUrls: ['./quiz-analytics.component.scss']
})
export class QuizAnalyticsComponent implements OnInit {
  @Input() assessment;
  @Input() utilitiesService : UtilitiesService;

  analytics = null;

  constructor(private manageService: ManageService) { }

  ngOnInit() {
  }

}
