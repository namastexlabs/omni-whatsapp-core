import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/main.ts!'],
  project: ['src/**/*.ts!', '!src/**/*.test.ts', '!src/**/*.spec.ts', '!src/@types/**'],
  ignore: [
    '**/*.d.ts',
    'prisma/**',
    'node_modules/**',
    'dist/**',
    'manager/**',
    'evolution-manager-v2/**',
    'src/utils/translations/**',
    'eslint-local-rules/**',
  ],
  // Only ignore dependencies that are truly used dynamically or via tooling
  // tsup: used in build script, tsx: used in start/dev scripts
  ignoreDependencies: [],
  ignoreBinaries: ['tsx'],
  ignoreExportsUsedInFile: true,
  rules: {
    files: 'error',
    dependencies: 'error',
    devDependencies: 'warn',
    unlisted: 'error',
    unresolved: 'error',
    exports: 'warn',
    types: 'warn',
    duplicates: 'warn',
    enumMembers: 'off',
    classMembers: 'off',
  },
  paths: {
    '@api/*': ['./src/api/*'],
    '@cache/*': ['./src/cache/*'],
    '@config/*': ['./src/config/*'],
    '@exceptions': ['./src/exceptions'],
    '@libs/*': ['./src/libs/*'],
    '@utils/*': ['./src/utils/*'],
    '@validate/*': ['./src/validate/*'],
  },
};

export default config;
