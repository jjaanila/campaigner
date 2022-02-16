// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/base',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'vue/no-unused-vars': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'vue/multi-word-component-names': 'off',
  },
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
  },
}
