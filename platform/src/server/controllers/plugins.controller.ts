import {
  controller,
  httpPost,
  response,
  request,
  httpGet
} from 'inversify-express-utils';

import { inject } from 'inversify';
import { Response, Request } from 'express';
import { CORE_TYPES } from '../ioc/core-types';
import { PluginsHandler } from '../core-api-impl/plugins-handler.api';
import { of } from 'rxjs';

@controller('/plugins')
export class PluginsController {
  constructor(
    @inject(CORE_TYPES.PluginsHandler) private pluginsApi: PluginsHandler
  ) {}

  @httpPost('/install')
  async install(@request() req: Request, @response() res: Response) {
    try {
      return await this.pluginsApi.install(req.body).toPromise();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
