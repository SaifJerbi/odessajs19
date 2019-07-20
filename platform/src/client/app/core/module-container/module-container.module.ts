import { NgModule } from '@angular/core';
import { ModuleContainerComponent } from '@app/core/module-container/widgets/module-container.component';
import { CoreSystemJsModuleLoader } from '@app/core/module-container/services/system-js-module-loader.service';

@NgModule({
  declarations: [ModuleContainerComponent],
  exports: [ModuleContainerComponent],
  providers: [CoreSystemJsModuleLoader],
  entryComponents: [ModuleContainerComponent]
})
export class ModuleContainerModule {}
