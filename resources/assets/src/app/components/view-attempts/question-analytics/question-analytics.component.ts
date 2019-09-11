import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-question-analytics',
  templateUrl: './question-analytics.component.html',
  styleUrls: ['./question-analytics.component.scss']
})
export class QuestionAnalyticsComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
