import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PluginsStore } from '@app/core/store';

@Injectable()
export class ModulesLoaderService {
  private modules: any[] = new Array<any>();

  constructor(
    private modulesStore: PluginsStore // private moduleService: ModuleClientApi, // private modulesStore: ModulesStore, // @Inject('API_PATHS') private apiPaths: {}
  ) {}

  loadModule(): Observable<any[]> {
    // this.moduleService
    //   .loadAllConfiguredModules()
    //   .pipe(
    //     tap(modules => {
    //       this.modules = this.modules.concat(modules);
    //     })
    //   )
    //   .subscribe(this.modulesStore);

    // return this.modulesStore.select().pipe(
    //   filter(Boolean),
    //   map(modules => modules.filter(module => module.loaded)),
    //   tap(modules => {
    //     modules.forEach(moduleLoaded => {
    //       this.apiPaths[`${moduleLoaded.routePath}`] = `${moduleLoaded.api}`;
    //     });
    //   })
    // );

    return of();
  }

  pushNewLoadedModule(newModule: any): void {
    // this.modules = this.modules.filter(
    //   module =>
    //     module.name !== newModule.name && module.version !== newModule.version
    // );
    // this.modules.push(newModule);
    // this.modulesStore.next(this.modules);
  }
}
