import { injectable } from 'inversify';
import { execSync } from 'child_process';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

@injectable()
export class YarnCli {
  constructor() {}

  install(moduleName: string, moduleAlias?: string): Observable<boolean> {
    return this.run(`yarn global add ${moduleAlias}@npm:${moduleName}`);
  }

  /**
   * get the yarn global directory with command line..
   */
  getYarnGlobalDir(): string {
    let yarnPath;
    try {
      const cmdResult = execSync('yarn global dir --json')
        .toString()
        .trim();
      yarnPath = cmdResult ? JSON.parse(cmdResult).data : undefined;
    } catch (error) {}
    return yarnPath;
  }
  /**
   * find the given module in the yarn global package.json
   * if the given module name existe then it should be installed globally
   *
   * @param  {string} name the module name in the format below 'scope/module_name/version'
   * @return {string} the full path of the module
   */
  findModulesIn(name: string): string {
    const searchPaths = this.getYarnGlobalDir();
    const yarnPackage = join(searchPaths, 'package.json');
    if (existsSync(yarnPackage)) {
      try {
        const file = readFileSync(yarnPackage, 'utf8');
        const fileContent = JSON.parse(file);
        if (
          Object.keys(fileContent.dependencies).filter(
            dependency => dependency === name
          ).length > 0
        ) {
          return join(searchPaths, 'node_modules', name);
        }
      } catch (err) {
        // this.logger.error(err);
      }
    } else {
      // this.logger.warning(
      //   `Global yarn installation folder doesn't not contains package.json file`
      // );
    }
    return undefined;
  }
  /**
   * read module information from module package.json file
   *
   * @param  {string} modulePath the module full path
   * @return {any} the module information
   */
  // tslint:disable-next-line
  getInfoFromPackageContent(modulePath: string): any {
    if (modulePath && existsSync(join(modulePath, 'package.json'))) {
      try {
        const fileContent = require(join(modulePath, 'package.json'));
        return {
          title: fileContent.title,
          description: fileContent.description,
          entryPointFile: `extensions/${fileContent.name}/${
            fileContent.entryPointFile
          }`,
          entryPointModule: fileContent.entryPointModule,
          entryPointCmp: fileContent.entryPointCmp
        };
      } catch (err) {
        // this.logger.error(err);
      }
    }
    return undefined;
  }
  private run(cmd: string): Observable<boolean> {
    const cmd$ = from(execSync(cmd)).pipe(
      map(stdout => {
        return true;
      }),
      catchError(error => {
        const errorMessage: string = error.stderr.toString();
        return throwError(errorMessage.substr(errorMessage.indexOf(' ') + 1));
      })
    );
    return cmd$;
  }
}
