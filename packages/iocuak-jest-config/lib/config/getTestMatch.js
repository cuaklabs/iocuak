import projectRoot from './projectRoot.js';

/**
 * @param { !string } testExtension Test extension files
 * @param { !boolean } isTargetingSource True if test are under the source folder
 * @returns { !string }
 */
function getTestMatch(testExtension, isTargetingSource) {
  let testMatch;

  if (isTargetingSource) {
    testMatch = `${projectRoot}/src/**/*${testExtension}`;
  } else {
    testMatch = `${projectRoot}/{dist,lib}/**/*${testExtension}`;
  }

  return testMatch;
}

export default getTestMatch;
