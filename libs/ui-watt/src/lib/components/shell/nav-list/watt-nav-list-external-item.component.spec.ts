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

import {
  WattNavListExternalItemComponent,
  WattNavListExternalItemScam,
} from './watt-nav-list-external-item.component';

import { render } from '@testing-library/angular';

describe(WattNavListExternalItemComponent.name, () => {
  it('`href` input property is `null` by default', async () => {
    const view = await render(WattNavListExternalItemComponent, {
      imports: [WattNavListExternalItemScam],
    });
    const component = view.fixture.componentInstance;
    expect(component.href).toBeNull();
  });

  it('`target` input property is `_self` by default', async () => {
    const view = await render(WattNavListExternalItemComponent, {
      imports: [WattNavListExternalItemScam],
    });
    const component = view.fixture.componentInstance;
    expect(component.target).toBe('_self');
  });
});
