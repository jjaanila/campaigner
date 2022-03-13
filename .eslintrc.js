// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'plugin:cypress/recommended',
  ],
  rules: {
    'vue/no-unused-vars': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-mutating-props': 'off', // The only way I have found to get inputs to work smoothly is with v-model and it triggers this eslint rule
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'no-only-tests/no-only-tests': ['error'],
  },
  plugins: ['no-only-tests'],
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
    jest: true,
    'vue/setup-compiler-macros': true,
  },
  parserOptions: {
    ecmaVersion: 2021,
  },
}
