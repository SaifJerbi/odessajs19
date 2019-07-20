import { Observable } from 'rxjs/Observable';
import { Product } from './models';

export interface DataApi {
  fetchProducts(): Observable<Product[]>;
  getProductDetails(ref: string): Observable<Product>;
}
