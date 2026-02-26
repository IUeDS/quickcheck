import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UtilitiesService } from '../../services/utilities.service';
import { NavStateService } from '../../services/nav-state.service';

@Component({
  selector: 'qc-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
  currentPage = 'help';
  isLoggedIn = false;
  isIU = false;

  constructor(
    public utilitiesService: UtilitiesService, 
    private userService: UserService,
    public navState: NavStateService
  ) { }

  async ngOnInit() {
    this.utilitiesService.setTitle('Documentation - Quick Check');
    this.isIU = this.utilitiesService.isIU();
    await this.getUser();

    //https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();

          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            // 1. Scroll to the element
            targetElement.scrollIntoView({
              behavior: 'instant'
            });

            // 2. Ensure the element can receive focus 
            // (This is a safety check if not added to the HTML)
            if (!targetElement.hasAttribute('tabindex')) {
              targetElement.setAttribute('tabindex', '-1');
            }

            // 3. Move the focus
            targetElement.focus({
              preventScroll: true // Prevents "double scrolling" in some browsers
            });
          }
      });
    });
  }

  async getUser() {
    try {
      const resp = await this.userService.getUser();
      const data = this.utilitiesService.getResponseData(resp);
      this.utilitiesService.setLtiHeight();
    }
    catch (error) {
      //just for the purposes of the documentation page, don't display an error if the user is
      //not logged-in, since this is a public resource; just hide the nav if not logged-in
      this.navState.visible = false;
      return;
    }
  }

}
