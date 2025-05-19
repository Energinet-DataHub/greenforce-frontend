//#region License
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
//#endregion
import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';

import JSDOMEnvironment from 'jest-environment-jsdom';
import { ResourceLoader, VirtualConsole } from 'jsdom';

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
            // Fix for https://github.com/thymikee/jest-preset-angular/issues/2194
            virtualConsole: new VirtualConsole().sendTo(options?.console || console, {
              omitJSDOMErrors: true,
            }),
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

    // Force Jest/JSDOM to use:
    // See https://github.com/jsdom/jsdom/issues/3363#issuecomment-1467894943
    this.global.structuredClone = structuredClone;

    // See https://github.com/mswjs/jest-fixed-jsdom/blob/main/index.js
    this.global.BroadcastChannel = BroadcastChannel;
    this.global.TransformStream = TransformStream;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.Worker = Worker;
  }
}

module.exports = JsdomLaxSslEnvironment;

class Worker {
  url: string | URL;
  onmessage: (msg: any) => void;
  constructor(stringUrl: string | URL) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg: string) {
    this.onmessage(msg);
  }

  terminate() {
    // No-op for this mock
  }
  addEventListener() {
    // No-op for this mock
  }
  removeEventListener() {
    // No-op for this mock
  }
  dispatchEvent(): boolean {
    // No-op for this mock
    return false;
  }
  onerror() {
    // No-op for this mock
  }
  onmessageerror() {
    // No-op for this mock
  }
}
