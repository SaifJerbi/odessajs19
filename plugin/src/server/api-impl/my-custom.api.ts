import { injectable } from 'inversify';
import { Observable, of } from 'rxjs';

@injectable()
export class MyCustomApi {
  getCalculatedData(): Observable<any> {
    return of({ data: { name: 'OdessaJs', country: 'Ukraine' } });
  }
}
