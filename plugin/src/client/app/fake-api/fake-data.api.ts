import { Observable, of } from 'rxjs';
import { DataClientApi } from 'odessajs19-plg-platform-shared-api/client/data.api';
import { Product } from 'odessajs19-plg-platform-shared-api/shared/models';

export class FakeDataApi extends DataClientApi {
  fetchProducts(): Observable<Product[]> {
    const products = [
      {
        category: { name: 'Tshirts', description: 'Tshirts collection' },
        ref: 'woo-vneck-tee',
        name: 'V-Neck T-Shirt',
        price: 18
      },
      {
        category: { name: 'Hoodie', description: 'Hoodies collectiion' },
        ref: 'woo-hoodie',
        name: 'Hoodie',
        price: 18
      },
      {
        category: { name: 'Hoodie', description: 'Hoodies collectiion' },
        ref: 'woo-hoodie-with-logo',
        name: 'Hoodie with Logo	',
        price: 11
      },
      {
        category: {
          name: 'Accessories',
          description: 'Accessories collection'
        },
        ref: 'woo-beanie',
        name: 'Beanie',
        price: 10
      },
      {
        category: {
          name: 'Accessories',
          description: 'Accessories collection'
        },
        ref: 'woo-belt',
        name: 'Belt',
        price: 21
      },
      {
        category: {
          name: 'Accessories',
          description: 'Accessories collection'
        },
        ref: 'woo-cap',
        name: 'Cap',
        price: 30
      }
    ];
    return of(products);
  }

  getProductDetails(ref: string): Observable<Product> {
    return of({
      category: { name: 'Tshirts', description: 'Tshirts collection' },
      ref: 'woo-vneck-tee',
      name: 'V-Neck T-Shirt',
      price: 18
    });
  }
}
