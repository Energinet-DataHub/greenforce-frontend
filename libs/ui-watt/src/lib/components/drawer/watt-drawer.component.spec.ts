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

import { WattDrawerModule } from './watt-drawer.module';
import { WattDrawerComponent } from './watt-drawer.component';

describe(WattDrawerComponent.name, () => {
  it('renders', async () => {
    await render(WattDrawerComponent, {
      declarations: [WattDrawerComponent],
      imports: [WattDrawerModule],
    });
  });

  /*
  it('should open drawer', () => {

  });

  it('should not add content more than once, when "open" is called multiple times', () => {

  });

  it('should close drawer, triggered externally outside of the drawer', () => {

  });

  it('should close drawer, triggered internally inside of the drawer', () => {

  });

  it('should destroy content when closing', () => {

  });


  */
});
