import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {
  @Input('attempt') attemptData;
  @Input() courseContext;
  @Input('responses') studentResponsesData;
  @Input('questions') questionsData;
  @Input('isStudent') isStudentData;

  showTableView = false;
  correctIconClass = 'fa-long-arrow-right'; //so we can easily swap out the correct icon

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
