import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesLoaderService } from '@app/core/services';
import { ModuleContainerModule } from '@app/core/module-container';
import { PluginsStore } from '@app/core/store';
import { PluginHandlerService } from '@app/core/services/plugin-handler.service';

@NgModule({
  imports: [CommonModule, ModuleContainerModule],
  providers: [ModulesLoaderService, PluginsStore, PluginHandlerService],
  exports: [ModuleContainerModule]
})
export class CoreModule {}
