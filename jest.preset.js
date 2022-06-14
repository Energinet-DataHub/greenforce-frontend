const nxPreset = require('@nrwl/jest/preset').default;

const path = require('path');

module.exports = {
  ...nxPreset,
  testEnvironment: path.join(
    __dirname,
    'scripts/gf/test-util',
    'jsdom-lax-ssl-environment.ts'
  ),
  testURL: 'https://localhost:5001',
};
