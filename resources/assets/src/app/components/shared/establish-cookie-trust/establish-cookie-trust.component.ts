import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'qc-establish-cookie-trust',
  templateUrl: './establish-cookie-trust.component.html',
  styleUrls: ['./establish-cookie-trust.component.scss']
})
export class EstablishCookieTrustComponent implements OnInit {
  trustPending = true;
  trustEstablished = false;
  trustError = false;

  constructor(public utilitiesService: UtilitiesService, public userService: UserService) { }

  async ngOnInit() {
    this.utilitiesService.setTitle('Establish Cookie Trust - Quick Check');
    this.utilitiesService.loadingStarted();

    try {
      await this.userService.establishCookieTrust();
      this.trustPending = false;
      this.trustEstablished = true;
    }
    catch (error) {
      this.trustPending = false;
      this.trustError = true;
      const errorMessage = 'Unable to establish trust. Please ensure that cookies are enabled in your browser.';
      this.utilitiesService.setError(errorMessage);
    }
  }

}
