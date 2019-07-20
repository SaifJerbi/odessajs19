import * as express from 'express';
import { injectable, ContainerModule, inject, optional } from 'inversify';
import { interfaces } from 'inversify-express-utils/lib/interfaces';
import {
  TYPE,
  METADATA_KEY,
  DEFAULT_ROUTING_ROOT_PATH,
  PARAMETER_TYPE,
  DUPLICATED_CONTROLLER_NAME
} from 'inversify-express-utils/lib/constants';

import {
  getControllersFromMetadata,
  getControllerMetadata,
  getControllerMethodMetadata,
  getControllerParameterMetadata,
  getControllersFromContainer
} from 'inversify-express-utils/lib/utils';
import { BaseMiddleware } from 'inversify-express-utils';
import { container } from '../server/express.init';
import { CORE_TYPES } from './core-types';

@injectable()
export class DependencyInjector {
  loadContainerModules(containerModule: ContainerModule): void {
    container.unload(containerModule);
    container.load(containerModule);
  }

  registerControllers(routingConfig: { rootPath: string }) {
    const _router = express.Router();

    // Fake HttpContext is needed during registration
    container
      .bind<interfaces.HttpContext>(TYPE.HttpContext)
      // tslint:disable-next-line
      .toConstantValue({} as any);

    const constructors = getControllersFromMetadata();
    const constructorsToRegister = [];
    constructors
      .filter(
        constructor =>
          !container.isBoundNamed(TYPE.Controller, constructor.name)
      )
      .forEach(constructor => {
        const name = constructor.name;

        if (container.isBoundNamed(TYPE.Controller, name)) {
          throw new Error(DUPLICATED_CONTROLLER_NAME(name));
        }

        container
          .bind(TYPE.Controller)
          .to(constructor)
          .whenTargetNamed(name);

        constructorsToRegister.push(constructor);
      });

    const controllers = getControllersFromContainer(container, false);

    controllers
      .filter((controller: interfaces.Controller) =>
        constructorsToRegister.some(
          constructor => constructor.name === controller.constructor.name
        )
      )
      .forEach((controller: interfaces.Controller) => {
        const controllerMetadata = getControllerMetadata(
          controller.constructor
        );
        const methodMetadata = getControllerMethodMetadata(
          controller.constructor
        );
        const parameterMetadata = getControllerParameterMetadata(
          controller.constructor
        );

        if (controllerMetadata && methodMetadata) {
          const controllerMiddleware = this.resolveMidleware(
            ...controllerMetadata.middleware
          );

          methodMetadata.forEach(
            (metadata: interfaces.ControllerMethodMetadata) => {
              let paramList: interfaces.ParameterMetadata[] = [];
              if (parameterMetadata) {
                paramList = parameterMetadata[metadata.key] || [];
              }
              const handler: express.RequestHandler = this.handlerFactory(
                controllerMetadata.target.name,
                metadata.key,
                paramList
              );
              const routeMiddleware = this.resolveMidleware(
                ...metadata.middleware
              );
              _router[metadata.method](
                `${controllerMetadata.path}${metadata.path}`,
                ...controllerMiddleware,
                ...routeMiddleware,
                handler
              );
            }
          );
        }
      });

    container
      .get<express.Application>(CORE_TYPES.ExpressServerInstance)
      .use(routingConfig.rootPath, _router);
  }

  private resolveMidleware(
    ...middleware: interfaces.Middleware[]
  ): express.RequestHandler[] {
    return middleware.map(middlewareItem => {
      if (container.isBound(middlewareItem)) {
        type MiddelwareInstance = express.RequestHandler | BaseMiddleware;
        const m = container.get<MiddelwareInstance>(middlewareItem);
        if (m instanceof BaseMiddleware) {
          const _self = this;
          return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
          ) => {
            const httpContext = _self._getHttpContext(req);
            // tslint:disable-next-line
            (m as any).httpContext = httpContext;
            m.handler(req, res, next);
          };
        } else {
          return m;
        }
      } else {
        return middlewareItem as express.RequestHandler;
      }
    });
  }

  private handlerFactory(
    // tslint:disable-next-line
    controllerName: any,
    key: string,
    parameterMetadata: interfaces.ParameterMetadata[]
  ): express.RequestHandler {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const args = this.extractParameters(req, res, next, parameterMetadata);

      (async () => {
        // We use a childContainer for each request so we can be
        // sure that the binding is unique for each HTTP request
        const childContainer = container.createChild();
        const httpContext = this._getHttpContext(req);
        // tslint:disable-next-line
        childContainer
          .bind<interfaces.HttpContext>(TYPE.HttpContext)
          .toConstantValue(httpContext);

        // invoke controller's action
        const result = childContainer
          // tslint:disable-next-line
          .getNamed<any>(TYPE.Controller, controllerName)
          [key](...args);
        Promise.resolve(result)
          // tslint:disable-next-line
          .then((value: any) => {
            if (value instanceof Function) {
              value();
            } else if (!res.headersSent) {
              if (value === undefined) {
                res.status(204);
              }
              res.send(value);
            }
          })
          // tslint:disable-next-line
          .catch((error: any) => next(error));
      })();
    };
  }

  private _getHttpContext(req: express.Request) {
    const httpContext = Reflect.getMetadata(METADATA_KEY.httpContext, req);
    return httpContext;
  }

  private extractParameters(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    params: interfaces.ParameterMetadata[]
    // tslint:disable-next-line
  ): any[] {
    const args = [];
    if (!params || !params.length) {
      return [req, res, next];
    }
    for (const item of params) {
      switch (item.type) {
        case PARAMETER_TYPE.REQUEST:
          args[item.index] = req;
          break;
        case PARAMETER_TYPE.NEXT:
          args[item.index] = next;
          break;
        case PARAMETER_TYPE.PARAMS:
          args[item.index] = this.getParam(req, 'params', item.parameterName);
          break;
        case PARAMETER_TYPE.QUERY:
          args[item.index] = this.getParam(req, 'query', item.parameterName);
          break;
        case PARAMETER_TYPE.BODY:
          args[item.index] = req.body;
          break;
        case PARAMETER_TYPE.HEADERS:
          args[item.index] = this.getParam(
            req,
            'headers',
            item.parameterName.toLowerCase()
          );
          break;
        case PARAMETER_TYPE.COOKIES:
          args[item.index] = this.getParam(req, 'cookies', item.parameterName);
          break;
        default:
          args[item.index] = res;
          break; // response
      }
    }
    args.push(req, res, next);
    return args;
  }

  private getParam(source: express.Request, paramType: string, name: string) {
    const param = source[paramType];
    return param ? param[name] : undefined;
  }
}
