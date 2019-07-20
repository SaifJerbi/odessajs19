import { Observable, of, empty } from 'rxjs';
import { inject, injectable } from 'inversify';
import { CORE_TYPES } from '../ioc/core-types';
import { YarnCli } from './modules/yarn-cli';
import { switchMap, map, first } from 'rxjs/operators';
import { DependencyInjector } from '../ioc/dependency-injector';
import { join } from 'path';

@injectable()
export class PluginsHandler {
  constructor(
    @inject(CORE_TYPES.YarnCli) private yarn: YarnCli,
    @inject(CORE_TYPES.DI)
    private injector: DependencyInjector
  ) {}

  install(plugin: any): Observable<any> {
    return this.yarn
      .install(
        `${plugin.package.name}@${plugin.package.version}`,
        `extensions/${plugin.package.name}`
      )
      .pipe(
        first(),
        map(installed => plugin),
        switchMap(installedPlg => {
          return this.loadPlugin(installedPlg);
        })
      );
  }

  fetchInstalled(): Observable<[]> {
    // return this.httpClient.get<[]>('/api/plugins');
    return of();
  }

  loadPlugin(plugin: any): Observable<boolean> {
    const rootPath = [
      '/api',
      plugin.package.name.substring(plugin.package.name.lastIndexOf('/') + 1),
      plugin.package.version
    ].join('/');

    const moduleFullName = join(plugin.package.name, plugin.package.version);

    const loadedModule = require(`extensions/${plugin.package.name}`);
    this.injector.loadContainerModules(loadedModule.getDIConfig());
    // load the module controller
    this.injector.registerControllers({
      rootPath
    });

    const installPath = this.yarn.findModulesIn(
      `extensions/${plugin.package.name}`
    );
    if (installPath) {
      return of(this.yarn.getInfoFromPackageContent(installPath));
    }
    return empty();
  }
}
