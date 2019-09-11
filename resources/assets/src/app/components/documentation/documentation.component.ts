import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'qc-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
  //TODO: add contact us email, show overview video, and support center link just for IU
  contactUsEmail = false;
  currentPage = 'help';
  isLoggedIn = false;
  showOverviewVideo = false;
  supportCenterLink = false;

  constructor(private utilitiesService: UtilitiesService, private userService: UserService) { }

  ngOnInit() {
  }

}
