import projectRoot from './projectRoot.js';

/**
 * @param { !string } testExtension Test extension files
 * @returns { !string }
 */
function getTestMatch(testExtension) {
  return `${projectRoot}/**/*${testExtension}`;
}

export default getTestMatch;
