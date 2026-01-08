import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CollectionIndexComponent } from './components/collection-index/collection-index.component';
import { ViewCollectionComponent } from './components/view-collection/view-collection.component';
import { EditAssessmentComponent } from './components/edit-assessment/edit-assessment.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { SelectComponent } from './components/select/select.component';
import { StudentViewComponent } from './components/student-view/student-view.component';
import { AttemptsOverviewComponent } from './components/attempts-overview/attempts-overview.component';
import { ViewAttemptsComponent } from './components/view-attempts/view-attempts.component';
import { ViewAttemptsForStudentComponent } from './components/view-attempts-for-student/view-attempts-for-student.component';
import { UsernotfoundComponent } from './components/errors/usernotfound/usernotfound.component';
import { SessionnotvalidComponent } from './components/errors/sessionnotvalid/sessionnotvalid.component';
import { LtisessionnotvalidComponent } from './components/errors/ltisessionnotvalid/ltisessionnotvalid.component';
import { ErrorComponent } from './components/errors/error/error.component';
import { EstablishCookieTrustComponent } from './components/shared/establish-cookie-trust/establish-cookie-trust.component';
import cloneDeep from 'lodash/cloneDeep';
import { CanDeactivateGuard } from './guards/can-deactivate-guard.service';

const routes: Routes = [
    { 
      path: '', 
      component: HomeComponent,
      data: { showNav: true, title: 'Home' } 
    },
    { 
      path: 'index.php', 
      component: HomeComponent,
      data: { showNav: true, title: 'Home' } 
    },
    { 
      path: 'home', 
      component: HomeComponent,
      data: { showNav: true, title: 'Home' } 
    },
    { 
      path: 'index.php/home', 
      component: HomeComponent,
      data: { showNav: true, title: 'Home' } 
    }, //if index.php included (as is in LTI routes), separate rule needed
    { 
      path: 'collection', 
      component: CollectionIndexComponent,
      data: { showNav: true, title: 'Sets' } 
    },
    { 
      path: 'collection/:id', 
      component: ViewCollectionComponent,
      data: { showNav: true, title: 'View set' } 
    },
    { 
      path: 'documentation', 
      component: DocumentationComponent,
      data: { showNav: true, title: 'Help' } 
    },
    { 
      path: 'assessment/:id/edit', 
      component: EditAssessmentComponent,
      data: { showNav: true, title: 'Edit quick check' }, 
      canDeactivate: [CanDeactivateGuard] 
    },
    { 
      path: 'assessment', 
      component: AssessmentComponent,
      data: { showNav: false, title: 'Quick Check' } 
    },
    { 
      path: 'index.php/assessment', 
      component: AssessmentComponent,
      data: { showNav: false, title: 'Quick Check' } 
    },
    { 
      path: 'assessment/:id', 
      component: AssessmentComponent,
      data: { showNav: false, title: 'Quick Check' }  
    },
    { 
      path: 'select', 
      component: SelectComponent,
      data: { showNav: false, title: 'Select quick check' }  
    },
    { path: 'index.php/select', component: SelectComponent },
    { 
      path: 'student', 
      component: StudentViewComponent,
      data: { showNav: false, title: 'View released results' }  
    },
    { 
      path: 'index.php/student', 
      component: StudentViewComponent,
      data: { showNav: false, title: 'View released results' }  
    },
    { 
      path: 'manage', 
      component: AttemptsOverviewComponent,
      data: { showNav: true, title: 'Results' } 
    },
    { 
      path: 'index.php/manage', 
      component: AttemptsOverviewComponent,
      data: { showNav: true, title: 'Results' } 
    },
    { 
      path: 'assessment/:assessmentId/attempts/:assignmentId/:resourceLinkId', 
      component: ViewAttemptsComponent,
      data: { showNav: true, title: 'View Quick Check Attempts' } 
    },
    { 
      path: 'assessment/:assessmentId/attempts', 
      component: ViewAttemptsComponent,
      data: { showNav: true, title: 'View Quick Check Attempts' }  
    },
    { 
      path: 'assessment/:assessmentId/attempts/:assignmentId', 
      component: ViewAttemptsComponent,
      data: { showNav: true, title: 'View Quick Check Attempts' }  
    },
    { 
      path: 'student/:studentId/attempts', 
      component: ViewAttemptsForStudentComponent,
      data: { showNav: true, title: 'View Student Attempts' }  
    },
    { 
      path: 'usernotfound', 
      component: UsernotfoundComponent,
      data: { showNav: false, title: 'User not found' }  
    },
    { 
      path: 'sessionnotvalid', 
      component: SessionnotvalidComponent,
      data: { showNav: false, title: 'Session not valid' }  
    },
    { 
      path: 'index.php/sessionnotvalid', 
      component: SessionnotvalidComponent,
      data: { showNav: false, title: 'Session not valid' }  
    },
    { 
      path: 'ltisessionnotvalid', 
      component: LtisessionnotvalidComponent,
      data: { showNav: false, title: 'LTI session not valid' }  
    },
    { 
      path: 'error', 
      component: ErrorComponent,
      data: { showNav: false, title: 'Quick Check - error' } 
    },
    { 
      path: 'index.php/error', 
      component: ErrorComponent,
      data: { showNav: false, title: 'Quick Check - error' } 
    },
    { 
      path: 'establishcookietrust', 
      component: EstablishCookieTrustComponent,
      data: { showNav: false, title: 'Establish Cookie Trust' } 
    },
    { 
      path: 'index.php/establishcookietrust', 
      component: EstablishCookieTrustComponent,
      data: { showNav: false, title: 'Establish Cookie Trust' } 
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
