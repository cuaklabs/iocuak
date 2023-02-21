/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export default async function pathExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch (_err) {
    return false;
  }
}
