import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'qc-quiz-analytics',
  templateUrl: './quiz-analytics.component.html',
  styleUrls: ['./quiz-analytics.component.scss']
})
export class QuizAnalyticsComponent implements OnInit {
  analytics = null;

  constructor(private manageService: ManageService, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
