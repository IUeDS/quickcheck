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
import * as cloneDeep from 'lodash/cloneDeep';
import { CanDeactivateGuard } from './guards/can-deactivate-guard.service';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'index.php', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'index.php/home', component: HomeComponent }, //if index.php included (as is in LTI routes), separate rule needed
    { path: 'collection', component: CollectionIndexComponent },
    { path: 'collection/:id', component: ViewCollectionComponent },
    { path: 'documentation', component: DocumentationComponent },
    { path: 'assessment/:id/edit', component: EditAssessmentComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'assessment', component: AssessmentComponent },
    { path: 'index.php/assessment', component: AssessmentComponent },
    { path: 'assessment/:id', component: AssessmentComponent },
    { path: 'select', component: SelectComponent },
    { path: 'index.php/select', component: SelectComponent },
    { path: 'student', component: StudentViewComponent },
    { path: 'index.php/student', component: StudentViewComponent },
    { path: 'manage', component: AttemptsOverviewComponent },
    { path: 'index.php/manage', component: AttemptsOverviewComponent },
    { path: 'assessment/:assessmentId/attempts/:assignmentId/:resourceLinkId', component: ViewAttemptsComponent },
    { path: 'assessment/:assessmentId/attempts', component: ViewAttemptsComponent },
    { path: 'assessment/:assessmentId/attempts/:assignmentId', component: ViewAttemptsComponent },
    { path: 'student/:studentId/attempts', component: ViewAttemptsForStudentComponent },
    { path: 'usernotfound', component: UsernotfoundComponent },
    { path: 'sessionnotvalid', component: SessionnotvalidComponent },
    { path: 'index.php/sessionnotvalid', component: SessionnotvalidComponent },
    { path: 'ltisessionnotvalid', component: LtisessionnotvalidComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'index.php/error', component: ErrorComponent },
    { path: 'establishcookietrust', component: EstablishCookieTrustComponent },
    { path: 'index.php/establishcookietrust', component: EstablishCookieTrustComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
