/* eslint-disable */
export default {
  displayName: 'dh-app',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: { crypto: require('crypto') },
  coverageDirectory: '../../coverage/apps/dh/app-dh',
  moduleNameMapper: {
    '.*watt-code.worker-factory': './watt-code.worker-mock-factory.ts',
    '@ngxpert/hot-toast': './libs/dh/shared/test-util/src/lib/dh-hot-toast.mock.ts',
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
