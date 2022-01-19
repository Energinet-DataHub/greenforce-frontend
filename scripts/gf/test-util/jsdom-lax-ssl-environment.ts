/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
