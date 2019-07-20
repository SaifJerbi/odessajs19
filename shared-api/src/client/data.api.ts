import { Observable } from 'rxjs/Observable';
import { Product } from '../shared/models';
import { DataApi } from '../shared/data.api';

export abstract class DataClientApi implements DataApi {
  abstract fetchProducts(): Observable<Product[]>;
  abstract getProductDetails(ref: string): Observable<Product>;
}
