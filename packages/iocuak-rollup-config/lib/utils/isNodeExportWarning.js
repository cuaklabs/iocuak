const NODE_JS_MODULES_PREFIX = 'node:';
const ROLLUP_CODE_UNRESOLVED_IMPORT = 'UNRESOLVED_IMPORT';

/**
 * @param {!import("rollup").RollupLog} warning
 * @returns boolean
 */
export default function isNodeExportWarning(warning) {
  return (
    warning.code === ROLLUP_CODE_UNRESOLVED_IMPORT &&
    warning.exporter !== undefined &&
    warning.exporter.startsWith(NODE_JS_MODULES_PREFIX)
  );
}
