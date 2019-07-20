import * as express from 'express';

import { controller, httpGet, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { EXT_TYPES } from '../ioc/my-extension.types';

@controller('/custom-plg1')
export class MyCustomController {
  constructor(@inject(EXT_TYPES.MyCustomApi) private myCustomApi) {}

  /**
   * GET /all
   * get all installed modules.
   */
  @httpGet('/calculated')
  async getCalculatedData(@response() res: express.Response) {
    try {
      return await this.myCustomApi.getCalculatedData().toPromise();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
