import multi from '@rollup/plugin-multi-entry';
import typescript from '@rollup/plugin-typescript';

/** @type {!import("rollup").MergedRollupOptions[]} */
export default [
  {
    input: './src/**/*.ts',
    output: [
      {
        dir: './lib/esm',
        format: 'esm',
      },
    ],
    plugins: [multi(), typescript()],
  },
];
