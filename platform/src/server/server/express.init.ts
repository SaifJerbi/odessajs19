import * as express from 'express';

import { Observable, of } from 'rxjs';

import { InversifyExpressServer } from 'inversify-express-utils';
import { urlencoded, json } from 'body-parser';
import { join } from 'path';
import { TYPES } from '@sejerbi/shared-api/server/types';
import { LoggerApi } from '@sejerbi/shared-api/server';

import { CORE_TYPES } from '../ioc/core-types';
import { YarnCli } from '../core-api-impl/modules/yarn-cli';
import { Container } from 'inversify';
import { DependencyInjector } from '../ioc/dependency-injector';
import { PluginsHandler } from '../core-api-impl/plugins-handler.api';

const CLIENT_PATH = join(__dirname, '../../client');
const IoCContainer = new Container();
// Init the express server and return the server Instance
export let initServer = (): Observable<express.Application> => {
  IoCContainer.bind<DependencyInjector>(CORE_TYPES.DI).to(DependencyInjector);
  IoCContainer.bind<YarnCli>(CORE_TYPES.YarnCli).to(YarnCli);
  IoCContainer.bind<PluginsHandler>(CORE_TYPES.PluginsHandler).to(
    PluginsHandler
  );

  if (IoCContainer.isBound(CORE_TYPES.ExpressServerInstance)) {
    const logger: LoggerApi = IoCContainer.get(TYPES.LoggerApi);
    logger.info('Server already initialized');
    return IoCContainer.get(CORE_TYPES.ExpressServerInstance);
  }

  // init NodePATHS
  const yarn: YarnCli = IoCContainer.get(CORE_TYPES.YarnCli);
  process.env['NODE_PATH'] = join(yarn.getYarnGlobalDir(), 'node_modules');
  require('module').Module._initPaths();

  const server = new InversifyExpressServer(IoCContainer, null, {
    rootPath: '/api'
  });
  const yarnCli: YarnCli = IoCContainer.get<YarnCli>(CORE_TYPES.YarnCli);

  const globalPath = yarnCli.getYarnGlobalDir();
  const thirdPartyPath = join(globalPath, 'node_modules', 'extensions');

  server.setConfig(app => {
    app.use(
      urlencoded({
        extended: true
      })
    );
    app.use(json());
    app.use(express.static(CLIENT_PATH));
    app.use('/extensions', express.static(thirdPartyPath));
  });

  const serverInstance = server.build();
  serverInstance.get('/', (req, res) => {
    res.sendFile(`index.html`, { root: CLIENT_PATH });
  });

  serverInstance.listen(3000);

  IoCContainer.bind(CORE_TYPES.ExpressServerInstance).toConstantValue(
    serverInstance
  );

  return of(serverInstance);
};

export const container = IoCContainer;
