import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CollectionIndexComponent } from './components/collection-index/collection-index.component';
import { ViewCollectionComponent } from './components/view-collection/view-collection.component';
import { EditAssessmentComponent } from './components/edit-assessment/edit-assessment.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { AssessmentComponent } from './components/assessment/assessment.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'collection', component: CollectionIndexComponent },
    { path: 'collection/:id', component: ViewCollectionComponent },
    { path: 'documentation', component: DocumentationComponent },
    { path: 'assessment/:id/edit', component: EditAssessmentComponent },
    { path: 'assessment', component: AssessmentComponent },
    { path: 'assessment/:id', component: AssessmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
