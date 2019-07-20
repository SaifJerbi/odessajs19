import { Component, OnInit } from '@angular/core';
import { DataClientApi } from 'odessajs19-plg-platform-shared-api/client/data.api';
import { Observable, Subject } from 'rxjs';
import { Product } from 'odessajs19-plg-platform-shared-api/shared/models';

@Component({
  selector: 'app-my-custom-widget',
  templateUrl: './my-custom-widget.component.html',
  styleUrls: ['./my-custom-widget.component.css']
})
export class MyCustomWidgetComponent implements OnInit {
  constructor(private dataApi: DataClientApi) {}

  product$: Subject<Product> = new Subject<Product>();
  data$: Observable<Product[]>;

  ngOnInit() {
    this.data$ = this.dataApi.fetchProducts();
  }

  display(product: Product) {
    this.product$.next(product);
  }
}
