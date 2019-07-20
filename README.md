
# Pluggable web application using Angular and NodeJS
To learn modularity we will develop together a pluggable web application and extend it by implementing a plugin that can be installed and loaded at runtime.


Features:
- Create a full stack micro app using Angular and NodeJS and publish it to npm registry
- Dynamically load external Angular micro app at runtime from npm registry
- Consume a shared API into the developed micro app

Remarks:
- The main platform application is already developed (just clone it)
- The micro app is using Angular 8 and NodeJS 12
- For lazy loading, the main platform use SystemJS loader, Angular compiler and DynamicViewChild

Requirements:
- NodeJS 12+
- Angular 8 with CLI installed
- Yarn and npm
- npm registry account as we will publish npm modules to the public registry


## Let's Start

Clone the whole repository and install the required dependencies for each project (using yarn or npm)

```
git clone https://github.com/SaifJerbi/odessajs19.git

git checkout tags/v1
```
## Install the platform locally

If you wanna focus only on the plugin development, you can just install the platform globally in your machine:

````
npm i -g  odessajs19-platform-demo
````
or
```
yarn global add odessajs19-plg-platform-demo
```

### Run the app locally
To run the app, you just run the command below:

```
odessa-workshop
```
Go to http://localhost:3000

### Development mode:

To start debugging the app, go to platform folder and start the NodeJS server by running :

```
yarn watch
```
And start the Angular layer by running:
```
ng serve ---proxy-config ./proxy.json
```
## Load your hello world plugin

> The main platform application will query the https://registry.npmjs.org to fetch all modules that have the keyword "odessajs-pluggable-app" so it will display all your published plugin into the public npm registry.

After installing the odessajs19-platform-demo application and running it, let's try our first module which is available in the npmjs registry.
Click install & load button to install the plugin into your environment.

## Create your own plugin

### Start dev mode

Pluggable application are designed to be extendable, so when you develop an extension (plugin), you can run your debugging mode in standalone.

```
cd plugin
ng serve --open
```

### Create a new custom component

A plugin has an entry point component which is the UI of the extension. So now we will create a new entry point for our plugin

```
ng g c my-plugin/my-custom-widget
```
Update the my-plugin.module.ts as follow:

```typescript
@NgModule({
declarations: [MyPluginComponent, MyCustomWidgetComponent],
imports: [CommonModule],
exports: [MyCustomWidgetComponent],
entryComponents: [MyCustomWidgetComponent]
})
export  class  MyPluginModule {}
```

Update the app.component.html and fill the new `<app-my-custom-widget>` component.

Go to package.json and update the entryPointCmp properties by "app-my-custom-widget"

Change the package name as you can not publish it with the same  name to npm registry and build it

```
yarn build
```
Go to dist folder and run: 
```
npm publish --access=public
```

### Load the new version into the platform

Bu refreshing the browser, the new published plugin should appear and you will be able to install it and load it.

### Let's build an awesome plugin using the Shared API

Add the shared api dependency to the plugin module
```
yarn add odessajs19-plg-platform-shared-api
// or 
npm i odessajs19-plg-platform-shared-api --save
```

Create a new folder under src/client/app/fake-api and add the fake-data.api.ts file:

```typescript
import { Observable, of } from  'rxjs';
import { DataClientApi } from  'odessajs19-plg-platform-shared-api/client/data.api';
import { Product } from  'odessajs19-plg-platform-shared-api/shared/models';

export  class  FakeDataApi  extends  DataClientApi {
	fetchProducts():  Observable<Product[]> {
		const  products  = [
			{
				category: { name:  'Tshirts', description:  'Tshirts collection' },
				ref:  'woo-vneck-tee',
				name:  'V-Neck T-Shirt',
				price:  18
			},
			{
				category: { name:  'Hoodie', description:  'Hoodies collectiion' },
				ref:  'woo-hoodie',
				name:  'Hoodie',
				price:  18
			},
			{
				category: { name:  'Hoodie', description:  'Hoodies collectiion' },
				ref:  'woo-hoodie-with-logo',
				name:  'Hoodie with Logo ',
				price:  11
			},
			{
				category: {
					name:  'Accessories',
					description:  'Accessories collection'
				},
				ref:  'woo-beanie',
				name:  'Beanie',
				price:  10
			},
		];
		return  of(products);
	}

getProductDetails(ref:  string):  Observable<Product> {
	return  of({
		category: { name:  'Tshirts', description:  'Tshirts collection' },
		ref:  'woo-vneck-tee',
		name:  'V-Neck T-Shirt',
		price:  18
		});
	}
}
```
And update the app.module.ts to provide this fake implementation of DataClientApi

```typescript
@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, MyPluginModule],
	providers: [{ provide:  DataClientApi, useClass:  FakeDataApi }],
	bootstrap: [AppComponent]
})
export  class  AppModule {}
```
And Now, we will consume this API into a Table that will show all products

```html
<table  class="table"  *ngIf="data$ | async as products">

<thead>

<tr>

<th  scope="col">Ref</th>

<th  scope="col">Name</th>

<th  scope="col">Price</th>

<th  scope="col">Category</th>

</tr>

</thead>

<tbody>

<tr  *ngFor="let product of products"  (click)="display(product)">

<th  scope="row">{{ product.ref }}</th>

<td>{{ product.name }}</td>

<td>{{ product.price }}</td>

<td>{{ product.category?.name }}</td>

</tr>

</tbody>

</table>

  

<div  class="card col-6"  *ngIf="product$ | async as product">

<div  class="card-header">

{{ product.category.name }}

</div>

<div  class="card-body">

<h4  class="card-title">{{ product.name }}</h4>

<p  class="card-text">{{ product.category.description }}</p>

<a  href="#"  class="btn btn-primary">Order</a>

</div>

</div>
```

And your ts file should looks like: 
```typescript
import { Component, OnInit } from  '@angular/core';
import { DataClientApi } from  'odessajs19-plg-platform-shared-api/client/data.api';
import { Observable, Subject } from  'rxjs';
import { Product } from  'odessajs19-plg-platform-shared-api/shared/models';

@Component({
	selector:  'app-my-custom-widget',
	templateUrl:  './my-custom-widget.component.html',
	styleUrls: ['./my-custom-widget.component.css']
})
export  class  MyCustomWidgetComponent  implements  OnInit {

	constructor(private  dataApi:  DataClientApi) {}

	product$:  Subject<Product> =  new  Subject<Product>();
	data$:  Observable<Product[]>;

	ngOnInit() {
		this.data$  =  this.dataApi.fetchProducts();
	}

	display(product:  Product) {
		this.product$.next(product);
	}
}
```

You need bootstrap library to have a great display:
```
npm i bootstrap --save
```
and update the styles section at the angular.json file
```
"styles": [
	"src/client/styles.css",
	"./node_modules/bootstrap/dist/css/bootstrap.min.css"
],
```

### Let's deliver new version of our plugin

Now that you have create a custom plugin, upgrade the version and run the build and publish command to deploy your plugin
Don't forget to delete the previous dist folder
```
npm version minor
npm run build
cd dist
npm publish
```

### Implement the Core API

As you see, we don't have a data core api implemented into the platform, so our component will not display data.

First, we need a new client service that implement the data api abstract class: 
```typescript 
import { HttpClient } from  '@angular/common/http';
import { Injectable } from  '@angular/core';
import { Observable } from  'rxjs';
import { DataClientApi } from  'odessajs19-plg-platform-shared-api/client/data.api';
import { Product } from  'odessajs19-plg-platform-shared-api/shared/models';

@Injectable()
export  class  DataApiService  extends  DataClientApi {
	constructor(private  httpClient:  HttpClient) {
		super();
	}
	fetchProducts():  Observable<Product[]> {
		return  this.httpClient.get<Product[]>('/api/data/products');
	}
	getProductDetails(ref:  string):  Observable<Product> {
		throw  new  Error('Method not implemented.');
	}
}
```

Update the core module and add this provider declaration

```typescript
{ provide:  DataClientApi, useClass:  DataApiService }
```

The frontend layer is ok, we need to focus now into the backend. So we will update the DataController to return the required data.

We will create a new DataApiService:

```typescript
@injectable()
export  class  DataServerApi  implements  DataApi {
	fetchProducts():  Observable<Product[]> {
		const  product:  Product  = {
					name:  'Single',
					ref:  'woo-single',
					price:  1,
					category: { name:  'Music', description:  'Music Summer 2019' }
		};
		return  of([product]);
	}

	getProductDetails(ref:  string):  Observable<Product> {
		throw  new  Error('Method not implemented.');
	}
}
```

And we will inject this service into the DataController.
```typescript
@controller('/data')
export  class  DataController {
	constructor(@inject(CORE_TYPES.DataServerApi) private  dataAPI:  DataApi) {}
	@httpGet('/products')
	async  getProducts(@request() req:  Request, @response() res:  Response) {
	try {
		return  await this.dataAPI.fetchProducts().toPromise();
	} catch (err) {
		res.status(500).json({ error:  err.message });
	}
}
```

The last step is to binding the DataApiService to the DataAPI interface using the IoCContainer. Update the core-types.ts file to add the new symbol:

```typescript
export  const  CORE_TYPES  = {
	ExpressServerInstance:  Symbol.for('ExpressServerInstance'),
	PluginsHandler:  Symbol.for('PluginsHandler'),
	YarnCli:  Symbol.for('YarnCli'),
	DI:  Symbol.for('DI'),
	DataServerApi:  Symbol.for('DataServer')
};
```

And update the express.init.ts file to bind the service :
```typescript
IoCContainer.bind<DataApi>(CORE_TYPES.DataServerApi).to(DataServerApi);
```

### Run your changes using the DEV Mode