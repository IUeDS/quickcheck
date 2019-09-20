import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'qc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentPage = 'home';
  isAddingAssessment = false;
  sessionExpired = false;

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.checkForExpiredSession();

    if (!this.utilitiesService.areCookiesEnabled()) {
      var errorMessage = this.utilitiesService.getCookieErrorMsg();
      this.utilitiesService.setError(errorMessage);
    }

    this.utilitiesService.setLtiHeight();
  }

  addAssessment() {
    this.isAddingAssessment = true;
  }

  cancelAdd() {
    this.isAddingAssessment = false;
  }

  //if the user ran an API call that resulted in an expired session warning from the back-end, then
  //they are redirected to the home page with a query param set to let us know to show an expired
  //session warning
  checkForExpiredSession() {
    this.sessionExpired = this.utilitiesService.isSessionExpired();
  }
}
