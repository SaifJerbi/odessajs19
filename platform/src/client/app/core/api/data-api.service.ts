import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataClientApi } from 'odessajs19-plg-platform-shared-api/client/data.api';
import { Product } from 'odessajs19-plg-platform-shared-api/shared/models';

@Injectable()
export class DataApiService extends DataClientApi {
  constructor(private httpClient: HttpClient) {
    super();
  }

  fetchProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/api/data/products');
  }

  getProductDetails(ref: string): Observable<Product> {
    throw new Error('Method not implemented.');
  }
}
