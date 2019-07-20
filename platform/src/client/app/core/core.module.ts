import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleContainerModule } from '@app/core/module-container';
import { PluginsStore } from '@app/core/store';
import { PluginHandlerService } from '@app/core/services/plugin-handler.service';
import { DataClientApi } from 'odessajs19-plg-platform-shared-api/client/data.api';
import { DataApiService } from '@app/core/api/data-api.service';

@NgModule({
  imports: [CommonModule, ModuleContainerModule],
  providers: [
    PluginsStore,
    PluginHandlerService,
    { provide: DataClientApi, useClass: DataApiService }
  ],
  exports: [ModuleContainerModule]
})
export class CoreModule {}
