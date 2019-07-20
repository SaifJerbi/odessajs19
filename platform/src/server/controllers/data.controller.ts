import {
  controller,
  httpGet,
  request,
  response
} from 'inversify-express-utils';
import { Response, Request } from 'express';

import { of } from 'rxjs';
import { inject } from 'inversify';
import { CORE_TYPES } from '../ioc/core-types';
import { DataApi } from 'odessajs19-plg-platform-shared-api/shared/data.api';

@controller('/data')
export class DataController {
  constructor(@inject(CORE_TYPES.DataServerApi) private dataAPI: DataApi) {}

  @httpGet('/products')
  async getProducts(@request() req: Request, @response() res: Response) {
    try {
      return await this.dataAPI.fetchProducts().toPromise();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
