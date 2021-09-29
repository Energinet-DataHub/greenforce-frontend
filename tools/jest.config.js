module.exports = {
  displayName: 'workspace-tools',
  preset: '../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../coverage/tools',
};