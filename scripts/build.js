'use strict';

const { execSync } = require('child_process');
const { inInstall } = require('in-publish');
const path = require('path');
const rimraf = require('rimraf');
const { promisify } = require('util');

if (inInstall()) {
  process.exit(0);
}

const rootDir = path.resolve(__dirname, '../');

const tsPath = path
  .resolve(__dirname, '../node_modules/.bin/tsc')
  .replace(/ /g, '\\ ');

const rollupPath = path
  .resolve(__dirname, '../node_modules/.bin/rollup')
  .replace(/ /g, '\\ ');

const rimrafAsync = promisify(rimraf);

const exec = (command, extraEnv) => {
  try {
    execSync(command, {
      stdio: 'inherit',
      env: Object.assign({}, process.env, extraEnv),
    });
  } catch (err) {
    if (extraEnv.module) {
      console.error(`Errors found when compiling to ${extraEnv.module}`);
    } else {
      console.error(err);
    }
  }
};

console.log('Deleting old build folders...'); // eslint-disable-line no-console

Promise.all([
  rimrafAsync(`${rootDir}/cjs/**`),
  rimrafAsync(`${rootDir}/es/**`),
  rimrafAsync(`${rootDir}/umd/**`),
])
  .then(() => {
    exec(
      `${tsPath} -p ${rootDir}/scripts/tsconfig.json -d -t ES5 -m CommonJS --outDir ${rootDir}/lib`,
      {
        module: 'CommonJS',
      }
    );

    exec(
      `${tsPath} -p ${rootDir}/scripts/tsconfig.json -d -t ES6 -m ES6 --outDir ${rootDir}/es`,
      {
        module: 'ES6',
      }
    );

    exec(
      `${rollupPath} -c scripts/rollup.config.js -o umd/carbon-components-react.js`,
      {
        NODE_ENV: 'development',
      }
    );
    exec(
      `${rollupPath} -c scripts/rollup.config.js -o umd/carbon-components-react.min.js`,
      {
        NODE_ENV: 'production',
      }
    );
  })
  .catch(error => {
    console.error('One of the commands failed:', error.stack); // eslint-disable-line no-console
    process.exit(1);
  });
