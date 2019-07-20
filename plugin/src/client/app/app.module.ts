import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyPluginModule } from './my-plugin/public-api';
import { FakeDataApi } from './fake-api/fake-data.api';
import { DataClientApi } from 'odessajs19-plg-platform-shared-api/client/data.api';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MyPluginModule],
  providers: [{ provide: DataClientApi, useClass: FakeDataApi }],
  bootstrap: [AppComponent]
})
export class AppModule {}
