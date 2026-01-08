// nav-state.service.ts
// Primarily for the help page, which needs to hide the nav bar if user isn't logged in
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavStateService {
  visible = true; // The app component shell will bind to this
}