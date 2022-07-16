/** @type { import("eslint").ESLint.ConfigData } */
module.exports = {
  extends: '@cuaklabs/eslint-config-iocuak',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
