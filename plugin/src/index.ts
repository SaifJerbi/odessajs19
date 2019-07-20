import { ContainerModule, interfaces } from 'inversify';
import { EXT_TYPES } from './server/ioc/my-extension.types';
import { MyCustomApi } from './server/api-impl/my-custom.api';

export let getDIConfig = () => {
  return new ContainerModule(
    (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
      bind<MyCustomApi>(EXT_TYPES.MyCustomApi).to(MyCustomApi);
    }
  );
};
