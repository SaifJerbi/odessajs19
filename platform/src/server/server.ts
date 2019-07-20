#!/usr/bin/env node
import 'reflect-metadata';
import './controllers/data.controller';
import './controllers/plugins.controller';
import Chalk from 'chalk';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { initServer } from './server/express.init';

console.log(
  `App running: ${Chalk.yellow('in ' + process.env.NODE_ENV + ' mode')} `
);
console.log(`Port ${Chalk.yellow('3000')}`);

console.log('Press CTRL-C to stop\n');

zip(initServer())
  .pipe(map(() => true))
  .subscribe(() => {});
