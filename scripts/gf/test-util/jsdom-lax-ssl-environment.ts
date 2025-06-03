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
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';

// Based on https://github.com/facebook/jest/issues/8701#issuecomment-512130059

class JsdomLaxSslEnvironment extends JSDOMEnvironment {
  constructor(config: JestEnvironmentConfig, options: EnvironmentContext) {
    // Don't pass problematic objects through config, create them after
    super(
      {
        ...config,
        projectConfig: {
          ...config.projectConfig,
          testEnvironmentOptions: {
            ...config.projectConfig.testEnvironmentOptions,
            // Taken from https://mswjs.io/docs/migrations/1.x-to-2.x#cannot-find-module-mswnode-jsdom
            customExportConditions: [''],
            // Remove problematic configurations that cause serialization issues
            url: config.projectConfig.testEnvironmentOptions?.['url'] || 'http://localhost',
            userAgent: config.projectConfig.testEnvironmentOptions?.['userAgent'] as string | undefined,
          },
        },
      },
      options
    );

    // Override the JSDOM instance after creation to apply our custom settings
    this.setupCustomJSDOM(options);

    // Force Jest/JSDOM to use:
    // See https://github.com/jsdom/jsdom/issues/3363#issuecomment-1467894943
    this.global.structuredClone = structuredClone;

    // See https://github.com/mswjs/jest-fixed-jsdom/blob/main/index.js
    this.global.BroadcastChannel = BroadcastChannel;
    this.global.TransformStream = TransformStream;
    this.global.Request = Request;
    this.global.Response = Response;
  }

  private setupCustomJSDOM(options: EnvironmentContext) {
    // Create our custom VirtualConsole
    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(options?.console || console, {
      omitJSDOMErrors: true,
    });

    // Create our custom ResourceLoader with lax SSL
    const resourceLoader = new ResourceLoader({
      strictSSL: false,
      userAgent: this.dom?.window.navigator.userAgent,
    });

    // Create a new JSDOM instance with our custom settings
    const customDom = new JSDOM(this.dom?.serialize(), {
      url: this.dom?.window.location.href,
      virtualConsole,
      resources: resourceLoader,
      runScripts: 'dangerously',
      pretendToBeVisual: true,
    });

    // Replace the existing DOM
    this.dom = customDom;
    this.global = customDom.window as any;
  }
}

module.exports = JsdomLaxSslEnvironment;
