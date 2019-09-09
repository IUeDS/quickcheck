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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorMessageComponent,
    NavComponent,
    QuickAddComponent,
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
