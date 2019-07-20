import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyPluginComponent } from './my-plugin.component';
import { MyCustomWidgetComponent } from './my-custom-widget/my-custom-widget.component';

@NgModule({
  declarations: [MyPluginComponent, MyCustomWidgetComponent],
  imports: [CommonModule],
  exports: [MyCustomWidgetComponent],
  entryComponents: [MyCustomWidgetComponent]
})
export class MyPluginModule {}
