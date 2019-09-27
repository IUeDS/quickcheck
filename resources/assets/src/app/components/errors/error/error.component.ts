import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'qc-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(public utilitiesService: UtilitiesService) { }

  error = 'An error occurred processing your request.';

  ngOnInit() {
    const errorMessage = this.utilitiesService.getQueryParam('error');
    if (errorMessage) {
      this.error = errorMessage;
    }
  }

}
