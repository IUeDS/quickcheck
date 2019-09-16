import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CollectionIndexComponent } from './components/collection-index/collection-index.component';
import { ViewCollectionComponent } from './components/view-collection/view-collection.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'collection', component: CollectionIndexComponent },
    { path: 'collection/:id', component: ViewCollectionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
