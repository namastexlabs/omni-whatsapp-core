module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
    EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true,
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'import', 'unused-imports', 'local-rules'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'eslint-local-rules/**/*', 'dist', 'node_modules'],
  rules: {
    // Keep existing disabled rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-wrapper-object-types': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',

    // Upgraded to warnings (gradual enforcement)
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Disable default no-unused-vars (unused-imports handles it)
    '@typescript-eslint/no-unused-vars': 'off',

    // NEW: Unused imports plugin (auto-fixable)
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],

    // Keep existing import rules
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    // NEW: Custom local rules
    'local-rules/no-console-in-production': 'warn',
    'local-rules/no-direct-process-env': 'error',
    'local-rules/no-hardcoded-credentials': 'error',
    'local-rules/consistent-error-handling': 'off',
  },
};
