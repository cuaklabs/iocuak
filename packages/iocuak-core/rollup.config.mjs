import typescript from '@rollup/plugin-typescript';

/** @type {!import("rollup").MergedRollupOptions[]} */
export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: './lib/esm',
        format: 'esm',
      },
    ],
    plugins: [typescript()],
  },
];
