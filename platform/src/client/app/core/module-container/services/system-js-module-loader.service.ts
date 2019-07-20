import { Injectable, Compiler } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import * as angularCore from '@angular/core';
import * as angularForms from '@angular/forms';
import * as angularCommonHttp from '@angular/common/http';
import * as angularCommon from '@angular/common';
import * as angularPlatformBrowser from '@angular/platform-browser';
import * as angularPlatformBrowserDynamic from '@angular/platform-browser-dynamic';
import * as sharedDataApiClient from 'odessajs19-plg-platform-shared-api/client/data.api';
import * as rxjsCore from 'rxjs';
import * as rxjsOperatorCore from 'rxjs/operators';

import { Observable, from } from 'rxjs';

declare const SystemJS: any;

// set modules so that no HTTP request is made
SystemJS.set(
  '@angular/platform-browser',
  SystemJS.newModule(angularPlatformBrowser)
);
SystemJS.set(
  '@angular/platform-browser-dynamic',
  SystemJS.newModule(angularPlatformBrowserDynamic)
);

SystemJS.set('@angular/core', SystemJS.newModule(angularCore));
SystemJS.set('@angular/forms', SystemJS.newModule(angularForms));
SystemJS.set('@angular/common/http', SystemJS.newModule(angularCommonHttp));
SystemJS.set('@angular/common', SystemJS.newModule(angularCommon));
SystemJS.set('rxjs', SystemJS.newModule(rxjsCore));
SystemJS.set('rxjs/operators', SystemJS.newModule(rxjsOperatorCore));

SystemJS.set(
  'odessajs19-plg-platform-shared-api/client/data.api',
  SystemJS.newModule(sharedDataApiClient)
);

@Injectable()
export class CoreSystemJsModuleLoader {
  constructor(private compiler: Compiler) {}

  load(
    path: string,
    moduleName: string
  ): Observable<angularCore.ModuleWithComponentFactories<any>> {
    return this.import(path).pipe(
      switchMap(plugin =>
        from(
          this.compiler.compileModuleAndAllComponentsAsync(plugin[moduleName])
        )
      )
    );
  }

  import(path: string): Observable<any> {
    return from(SystemJS.import(path));
  }
}
