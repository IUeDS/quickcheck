import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-question-analytics',
  templateUrl: './question-analytics.component.html',
  styleUrls: ['./question-analytics.component.scss']
})
export class QuestionAnalyticsComponent implements OnInit {
  @Input() question;

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
