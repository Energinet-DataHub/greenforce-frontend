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
import { APP_BASE_HREF } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { AbsoluteUrlGenerator } from './absolute-url-generator.service';

describe(AbsoluteUrlGenerator.name, () => {
  beforeEach(() => {
    baseHref = TestBed.inject(APP_BASE_HREF);
    service = TestBed.inject(AbsoluteUrlGenerator);
  });

  let baseHref: string;
  let service: AbsoluteUrlGenerator;

  it('generates an absolute URL from an app URL with leading slash', () => {
    const url = service.fromUrl('/test-report/2021');

    expect(url).toBe(`${baseHref}test-report/2021`);
  });

  it('generates an absolute URL from an app URL without leading slash', () => {
    const url = service.fromUrl('test-declaration/2021');

    expect(url).toBe(`${baseHref}test-declaration/2021`);
  });

  it('generates an absolute URL from router commands', () => {
    const url = service.fromCommands(['test-metering-point', 123]);

    expect(url).toBe(`${baseHref}test-metering-point/123`);
  });
});
