import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-row-feedback',
  templateUrl: './row-feedback.component.html',
  styleUrls: ['./row-feedback.component.scss']
})
export class RowFeedbackComponent implements OnInit {

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

}
