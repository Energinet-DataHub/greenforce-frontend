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
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import '@testing-library/jest-dom/vitest';
import { addDomMatchers } from '@energinet-datahub/gf/test-util-matchers';
import { setUpTestbed } from '@energinet-datahub/gf/test-util-staging';

// Fix for MouseEvent constructor in jsdom
global.MouseEvent = class MouseEvent extends Event {
  constructor(type: string, init?: MouseEventInit) {
    super(type, init);
  }
} as any;

// Suppress CSS parsing errors from jsdom
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    args[0]?.toString().includes('Could not parse CSS stylesheet') ||
    args[0]?.toString().includes('Error: Could not parse CSS stylesheet')
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

addDomMatchers();
setUpTestbed();
