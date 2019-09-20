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
import * as cloneDeep from 'lodash/cloneDeep';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'collection', component: CollectionIndexComponent },
    { path: 'collection/:id', component: ViewCollectionComponent },
    { path: 'documentation', component: DocumentationComponent },
    { path: 'assessment/:id/edit', component: EditAssessmentComponent },
    { path: 'assessment', component: AssessmentComponent },
    { path: 'assessment/:id', component: AssessmentComponent },
    { path: 'select', component: SelectComponent },
    { path: 'student', component: StudentViewComponent },
    { path: 'manage', component: AttemptsOverviewComponent }
];

//if index.php is in route, make sure angular doesn't choke;
//use standard for loop since we're adding onto the array length
const routeLength = routes.length;
for (let i = 0; i < routeLength; i++) {
    const indexRoute = cloneDeep(routes[i]);
    indexRoute.path = 'index.php/' + indexRoute.path;
    routes.push(indexRoute);
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
