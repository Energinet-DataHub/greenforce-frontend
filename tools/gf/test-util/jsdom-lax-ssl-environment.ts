const JSDOMEnvironment = require('jest-environment-jsdom');
const { ResourceLoader } = require('jsdom');

import type { Config } from '@jest/types';
import type { EnvironmentContext } from '@jest/environment';

// Based on https://github.com/facebook/jest/issues/8701#issuecomment-512130059

class JsdomLaxSslEnvironment extends JSDOMEnvironment {
  constructor(config: Config.ProjectConfig, options?: EnvironmentContext) {
    super(
      {
        ...config,
        testEnvironmentOptions: {
          ...config.testEnvironmentOptions,
          resources: new ResourceLoader({
            // this is all we want to change
            // allow self-signed certificates
            strictSSL: false,
            userAgent: config.testEnvironmentOptions?.userAgent as
              | string
              | undefined,
          }),
        },
      },
      options
    );
  }
}

module.exports = JsdomLaxSslEnvironment;
