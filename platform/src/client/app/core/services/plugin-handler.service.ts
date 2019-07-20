import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PluginHandlerService {
  constructor(private httpClient: HttpClient) {}

  install(plugin: any): Observable<any> {
    return this.httpClient.post<any>('/api/plugins/install', plugin);
  }

  fetchInstalled(): Observable<[]> {
    return this.httpClient.get<[]>('/api/plugins');
  }
}
