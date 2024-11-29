/* eslint-disable */
export default {
  displayName: 'eo-shared-services',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../../coverage/libs/eo/shared/services',
  /**
   * https://stackoverflow.com/questions/42260218/jest-setup-syntaxerror-unexpected-token-export
   * NG2-charts has an error with lodash-es, Jest tests fail if this is not added.
   */
  moduleNameMapper: { 'lodash-es': 'lodash' },
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
