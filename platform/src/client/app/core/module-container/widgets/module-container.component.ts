import {
  Component,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CoreSystemJsModuleLoader } from '@app/core/module-container/services/system-js-module-loader.service';
import { ActivatedRoute } from '@angular/router';
import { PluginsStore } from '@app/core/store';
import { switchMap, take, filter } from 'rxjs/operators';
import { zip } from 'rxjs';

@Component({ selector: 'app-container', template: '<div #vc></div>' })
export class ModuleContainerComponent implements OnInit {
  @ViewChild('vc', { read: ViewContainerRef, static: true })
  vc;
  constructor(
    private loader: CoreSystemJsModuleLoader,
    private injector: Injector,
    private modulesStore: PluginsStore
  ) {}

  ngOnInit(): void {
    zip(
      this.modulesStore.select().pipe(
        filter(Boolean),
        take(1)
      ),
      this.modulesStore.select().pipe(
        filter(Boolean),
        take(1),
        switchMap(plugin => {
          return this.loader.load(
            plugin.entryPointFile,
            plugin.entryPointModule
          );
        })
      )
    ).subscribe(([plugin, compiled]) => {
      const moduleFactory = compiled.ngModuleFactory.create(this.injector);
      const componentFactory = compiled.componentFactories.find(
        cmp => cmp.selector === plugin.entryPointCmp
      );
      this.vc.createComponent(componentFactory, this.injector, moduleFactory);
    });
  }
}
