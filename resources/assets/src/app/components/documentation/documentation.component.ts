import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'qc-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
  currentPage = 'help';
  isLoggedIn = false;
  isIU = false;

  constructor(public utilitiesService: UtilitiesService, private userService: UserService) { }

  async ngOnInit() {
    this.utilitiesService.setTitle('Documentation - Quick Check');
    this.isIU = this.utilitiesService.isIU();
    await this.getUser();

    //https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();

          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'instant'
          });
      });
    });
  }

  async getUser() {
    try {
      const resp = await this.userService.getUser();
      const data = this.utilitiesService.getResponseData(resp);
      this.isLoggedIn = true;
      this.utilitiesService.setLtiHeight();
    }
    catch (error) {
      //just for the purposes of the documentation page, don't display an error if the user is
      //not logged-in, since this is a public resource; just hide the nav if not logged-in
      this.isLoggedIn = false;
      return;
    }
  }

}
