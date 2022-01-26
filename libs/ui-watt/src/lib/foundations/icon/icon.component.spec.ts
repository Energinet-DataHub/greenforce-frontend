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
import { render } from '@testing-library/angular';

import {
  WattIconComponent,
  WattIconModule,
  WattIconSize,
  WattIconState,
} from './index';

describe(WattIconComponent.name, () => {
  it('has default size', async () => {
    const view = await render(WattIconComponent, {
      componentProperties: {
        name: 'success',
      },
      imports: [WattIconModule],
    });

    const component = view.fixture.componentInstance;

    expect(component.size).toBe(WattIconSize.Medium);
  });

  describe('host classes', () => {
    it('has default `size` class', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: 'success',
        },
        imports: [WattIconModule],
      });

      const actualClasses = Object.keys(view.fixture.debugElement.classes);

      expect(actualClasses).toContain('icon-size-m');
    });

    it('can set `size` class', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: 'success',
          size: WattIconSize.Large,
        },
        imports: [WattIconModule],
      });

      const actualClasses = Object.keys(view.fixture.debugElement.classes);

      expect(actualClasses).toContain('icon-size-l');
    });

    it('can set `state` class', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: 'success',
          state: WattIconState.Success,
        },
        imports: [WattIconModule],
      });

      const actualClasses = Object.keys(view.fixture.debugElement.classes);

      expect(actualClasses).toContain('icon-state-success');
    });
  });
});
