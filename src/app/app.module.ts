import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { EmailGenerateComponent } from './components/email-generate/email-generate.component';
import { EmailInboxComponent } from './components/email-inbox/email-inbox.component';

@NgModule({
  declarations: [AppComponent, EmailGenerateComponent, EmailInboxComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
