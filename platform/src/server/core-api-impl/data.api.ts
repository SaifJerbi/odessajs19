import { injectable } from 'inversify';
import { DataApi } from 'odessajs19-plg-platform-shared-api/shared/data.api';
import { of, Observable } from 'rxjs';
import { Product } from 'odessajs19-plg-platform-shared-api/shared/models';

@injectable()
export class DataServerApi implements DataApi {
  fetchProducts(): Observable<Product[]> {
    const product: Product = {
      name: 'Single',
      ref: 'woo-single',
      price: 1,
      category: { name: 'Music', description: 'Music Summer 2019' }
    };
    return of([product]);
  }
  getProductDetails(ref: string): Observable<Product> {
    throw new Error('Method not implemented.');
  }
}
