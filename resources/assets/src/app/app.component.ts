import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavStateService } from './services/nav-state.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageTitle = 'Quick Check';
  private isFirstLoad = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public navState: NavStateService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // 1. Get the current route data
      let route = this.activatedRoute.root;
      while (route.firstChild) {
        route = route.firstChild;
      } 
      const data = route.snapshot.data;

      // 2. Set the Nav visibility based on the route definition
      this.navState.visible = data['showNav'] !== false;
      this.pageTitle = data['title'] || 'Quick Check';

      // 3. Accessibility: Move focus to the main container
      // If it's the very first time the app loads, stay at the top.
      if (this.isFirstLoad) {
        this.isFirstLoad = false;
        return; 
      }

      // On subsequent navigations, move focus to main.
      // The user just used the nav, so we move them to the content.
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    });
  }

  skipToContent(event: Event) {
    event.preventDefault(); // Stop the browser/router from changing the URL
    const content = document.getElementById('main-content');
    if (content) {
      content.focus();
    }
  }
}
