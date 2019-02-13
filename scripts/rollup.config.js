'use strict';

const chalk = require('chalk');
const Table = require('cli-table');
const gzip = require('gzip-size');

const typescriptPlugin = require('rollup-plugin-typescript');
const typescript = require('typescript');

const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');
const sizes = require('rollup-plugin-sizes');

const packageJson = require('../package.json');
const peerDependencies = Object.keys(packageJson.peerDependencies || {}).concat(
  ['classnames', 'prop-types']
);

const env = process.env.NODE_ENV || 'development';
const prodSettings =
  env === 'development'
    ? []
    : [
        uglify(),
        sizes({
          report(details) {
            const table = new Table({
              head: [
                chalk.gray.yellow('Dependency/app'),
                chalk.gray.yellow('Size'),
              ],
              colAligns: ['left', 'right'],
            });
            details.totals
              .map(item => [chalk.white.bold(item.name), item.size])
              .forEach(item => {
                table.push(item);
              });
            console.log(`Sizes of app/dependencies:\n${table}`); // eslint-disable-line no-console
            console.log('Total size:', details.total); // eslint-disable-line no-console
          },
        }),
        {
          ongenerate(bundle, details) {
            const gzipSize = gzip.sync(details.code);
            const { bundleSizeThreshold } = packageJson;
            console.log('Total size (gzipped):', gzipSize); // eslint-disable-line no-console
            if (gzipSize > bundleSizeThreshold) {
              throw new RangeError(
                `Exceeded size threshold of ${bundleSizeThreshold} bytes (gzipped)!`
              );
            }
          },
        },
      ];

process.env.BABEL_ENV = 'es';

module.exports = {
  input: 'src/index.ts',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
    }),
    typescriptPlugin({
      typescript,
      importHelpers: true,
    }),
    commonjs({
      include: 'node_modules/**',
      sourceMap: true,
      extensions: ['.js'],
      namedExports: {
        'node_modules/react/index.js': [
          'Children',
          'Component',
          'PureComponent',
          'Fragment',
          'PropTypes',
          'createElement',
        ],
        'node_modules/react-dom/index.js': ['render'],
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    ...prodSettings,
  ],
  external: peerDependencies.filter(
    dependency => dependency !== 'carbon-components'
  ),
  output: {
    name: 'CarbonComponentsReact',
    format: 'umd',
    globals: {
      classnames: 'classNames',
      'prop-types': 'PropTypes',
      react: 'React',
      'react-dom': 'ReactDOM',
      'carbon-icons': 'CarbonIcons',
    },
  },
};
