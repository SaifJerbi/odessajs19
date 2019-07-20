import * as path from 'path';
import { ngPackagr } from 'ng-packagr';

ngPackagr()
  .forProject('package.json')
  .withTsConfig(path.resolve(__dirname, 'tsconfig.packagr.json'))
  .build();
