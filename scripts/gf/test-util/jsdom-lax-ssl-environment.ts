import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';

import JSDOMEnvironment from 'jest-environment-jsdom';
const { ResourceLoader } = require('jsdom');

// Based on https://github.com/facebook/jest/issues/8701#issuecomment-512130059

class JsdomLaxSslEnvironment extends JSDOMEnvironment {
  constructor(config: JestEnvironmentConfig, options: EnvironmentContext) {
    super(
      {
        ...config,
        projectConfig: {
          ...config.projectConfig,
          testEnvironmentOptions: {
            ...config.projectConfig.testEnvironmentOptions,
            // Taken from https://mswjs.io/docs/migrations/1.x-to-2.x#cannot-find-module-mswnode-jsdom
            customExportConditions: [''],
            resources: new ResourceLoader({
              // this is all we want to change
              // allow self-signed certificates
              strictSSL: false,
              userAgent: config.projectConfig.testEnvironmentOptions?.['userAgent'] as
                | string
                | undefined,
            }),
          },
        },
      },
      options
    );

    // Force Jest/jsdom to use structuredClone
    // See https://github.com/jsdom/jsdom/issues/3363#issuecomment-1467894943
    this.global.structuredClone = structuredClone;
  }
}

module.exports = JsdomLaxSslEnvironment;
