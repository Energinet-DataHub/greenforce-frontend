const { ResourceLoader } = require('jsdom');
const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  testEnvironmentOptions: {
    resources: new ResourceLoader({
      // allow self-signed certificates
      strictSSL: false,
    }),
  },
  testURL: 'https://localhost:5001',
};
