import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorMessageComponent } from './components/shared/error-message/error-message.component';
import { NavComponent } from './components/shared/nav/nav.component';
import { QuickAddComponent } from './components/home/quick-add/quick-add.component';
import { CollectionIndexComponent } from './components/collection-index/collection-index.component';
import { AdminPanelComponent } from './components/collection-index/admin-panel/admin-panel.component';
import { AddCollectionComponent } from './components/collection-index/add-collection/add-collection.component';
import { AddCustomActivityComponent } from './components/collection-index/add-custom-activity/add-custom-activity.component';
import { CollectionTileComponent } from './components/collection-index/collection-tile/collection-tile.component';
import { CustomActivitiesPanelComponent } from './components/collection-index/custom-activities-panel/custom-activities-panel.component';
import { CustomActivityComponent } from './components/collection-index/custom-activity/custom-activity.component';
import { InviteAdminComponent } from './components/collection-index/invite-admin/invite-admin.component';
import { PublicCollectionsComponent } from './components/collection-index/public-collections/public-collections.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { EditIconComponent } from './components/shared/edit-icon/edit-icon.component';
import { DeleteIconComponent } from './components/shared/delete-icon/delete-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorMessageComponent,
    NavComponent,
    QuickAddComponent,
    CollectionIndexComponent,
    AdminPanelComponent,
    AddCollectionComponent,
    AddCustomActivityComponent,
    CollectionTileComponent,
    CustomActivitiesPanelComponent,
    CustomActivityComponent,
    InviteAdminComponent,
    PublicCollectionsComponent,
    LoadingComponent,
    EditIconComponent,
    DeleteIconComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
