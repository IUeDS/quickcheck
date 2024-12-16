//source: https://scotch.io/courses/routing-angular-applications/candeactivate
import { Injectable } from '@angular/core';


export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable()
export class CanDeactivateGuard  {

  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

}