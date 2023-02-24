import multi from '@rollup/plugin-multi-entry';
import typescript from '@rollup/plugin-typescript';

const TS_LIB_WARN_MESSAGE =
  "@rollup/plugin-typescript TS2354: This syntax requires an imported helper but module 'tslib' cannot be found.";

/**
 * @param {!import("rollup").RollupLog} warning
 * @returns boolean
 */
function isTsLibRequiredWarning(warning) {
  return warning.message === TS_LIB_WARN_MESSAGE;
}

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
    onwarn: (warning, defaultHandler) => {
      if (!isTsLibRequiredWarning(warning)) {
        defaultHandler(warning);
      }
    },
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
