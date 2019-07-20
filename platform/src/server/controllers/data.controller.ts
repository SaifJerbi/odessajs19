import {
  controller,
  httpGet,
  request,
  response
} from 'inversify-express-utils';
import { Response, Request } from 'express';

import { of } from 'rxjs';

@controller('/data')
export class DataController {
  @httpGet('/products')
  async install(@request() req: Request, @response() res: Response) {
    try {
      // return await this.pluginsApi.install(req.body).toPromise();
      return of().toPromise();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
