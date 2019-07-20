import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyPluginComponent } from './my-plugin.component';

@NgModule({
  declarations: [MyPluginComponent],
  imports: [CommonModule],
  exports: [MyPluginComponent],
  entryComponents: [MyPluginComponent]
})
export class MyPluginModule {}
