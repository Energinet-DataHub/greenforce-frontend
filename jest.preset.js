const nxPreset = require('@nx/jest/preset').default;

const path = require('path');

module.exports = {
  ...nxPreset,
  testEnvironment: path.join(__dirname, 'scripts/gf/test-util', 'jsdom-lax-ssl-environment.ts'),
  testURL: 'https://localhost:5001',
  setupFiles: [path.join(__dirname, 'jest.polyfills.js')],
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: "nx affected --targets=test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
