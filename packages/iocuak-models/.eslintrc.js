/** @type { import("eslint").ESLint.ConfigData } */
module.exports = {
  extends: '@cuaklabs/eslint-config-iocuak',
  parserOptions: {
    project: ['./tsconfig.cjs.json'],
    tsconfigRootDir: __dirname,
  },
};
