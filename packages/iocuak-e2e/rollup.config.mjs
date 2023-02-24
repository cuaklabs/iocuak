import multi from '@rollup/plugin-multi-entry';
import typescript from '@rollup/plugin-typescript';

/** @type {!import("rollup").MergedRollupOptions[]} */
export default [
  {
    external: [
      '@cuaklabs/iocuak',
      '@cucumber/cucumber',
      'chai',
      'sinon',
      'sinon-chai',
    ],
    input: './src/**/*.ts',
    output: [
      {
        dir: './lib/esm',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [multi(), typescript()],
  },
];
