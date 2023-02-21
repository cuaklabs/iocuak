const TS_LIB_WARN_MESSAGE =
  "@rollup/plugin-typescript TS2354: This syntax requires an imported helper but module 'tslib' cannot be found.";

/**
 * @param {!import("rollup").RollupLog} warning
 * @returns boolean
 */
export default function isTsLibRequiredWarning(warning) {
  return warning.message === TS_LIB_WARN_MESSAGE;
}
