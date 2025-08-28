module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'off',
    'no-undef': 'off', // TypeScript handles this
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
