import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyPluginModule } from './my-plugin/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MyPluginModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
