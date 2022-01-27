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

import { WattIcon } from './icons';
import {
  WattIconComponent,
  WattIconModule,
  WattIconSize,
  WattIconState,
} from './index';

describe(WattIconComponent.name, () => {
  it('has default `size`', async () => {
    const view = await render(WattIconComponent, {
      componentProperties: {
        name: 'search',
      },
      imports: [WattIconModule],
    });

    const component = view.fixture.componentInstance;

    expect(component.size).toBe(WattIconSize.Medium);
  });

  it('has default `state`', async () => {
    const view = await render(WattIconComponent, {
      componentProperties: {
        name: 'search',
      },
      imports: [WattIconModule],
    });

    const component = view.fixture.componentInstance;

    expect(component.state).toBe(WattIconState.Default);
  });

  describe('host classes', () => {
    describe('`size` class', () => {
      it('has default value', async () => {
        const view = await render(WattIconComponent, {
          componentProperties: {
            name: 'search',
          },
          imports: [WattIconModule],
        });

        const actualClasses = Object.keys(view.fixture.debugElement.classes);

        expect(actualClasses).toContain('icon-size-m');
      });

      it('can be set', async () => {
        const view = await render(WattIconComponent, {
          componentProperties: {
            name: 'search',
            size: WattIconSize.Large,
          },
          imports: [WattIconModule],
        });

        const actualClasses = Object.keys(view.fixture.debugElement.classes);

        expect(actualClasses).toContain('icon-size-l');
      });
    });

    describe('`state` class', () => {
      it('has default value', async () => {
        const view = await render(WattIconComponent, {
          componentProperties: {
            name: 'search',
          },
          imports: [WattIconModule],
        });

        const actualClasses = Object.keys(view.fixture.debugElement.classes);

        expect(actualClasses).toContain('icon-state-default');
      });

      it('can be set', async () => {
        const view = await render(WattIconComponent, {
          componentProperties: {
            name: 'search',
            state: WattIconState.Success,
          },
          imports: [WattIconModule],
        });

        const actualClasses = Object.keys(view.fixture.debugElement.classes);

        expect(actualClasses).toContain('icon-state-success');
      });
    });
  });

  describe.each([
    ['success', WattIconState.Success, 'icon-state-success'],
    ['danger', WattIconState.Danger, 'icon-state-danger'],
    ['warning', WattIconState.Warning, 'icon-state-warning'],
    ['info', WattIconState.Info, 'icon-state-info'],
  ])('%s icon', (icon, ownDefaultState, ownStateClass) => {
    it('has own default state', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: icon as WattIcon,
        },
        imports: [WattIconModule],
      });

      const component = view.fixture.componentInstance;

      expect(component.state).toBe(ownDefaultState);
    });

    it('has own default state class', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: icon as WattIcon,
        },
        imports: [WattIconModule],
      });

      const actualClasses = Object.keys(view.fixture.debugElement.classes);

      expect(actualClasses).toContain(ownStateClass);
    });

    it('cat be set to a different state', async () => {
      const view = await render(WattIconComponent, {
        componentProperties: {
          name: icon as WattIcon,
          state: WattIconState.Default,
        },
        imports: [WattIconModule],
      });

      const actualClasses = Object.keys(view.fixture.debugElement.classes);

      expect(actualClasses).not.toContain(ownStateClass);
    });
  });
});
