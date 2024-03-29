/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-constant-condition': 'off',
    'no-empty': 'off',
    'no-extra-boolean-cast': 'off',
    'no-prototype-builtins': 'off',
    'no-useless-escape': 'off',
    'prefer-const': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
    },
  ],
};
