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
import { render, screen } from '@testing-library/angular';

import { EoProductLogoComponent, EoProductLogoDirective } from './eo-product-logo.directive';

describe(EoProductLogoDirective.name, () => {
  beforeEach(async () => {
    await render('<img eoProductLogo>', {
      imports: [EoProductLogoComponent],
    });

    hostElement = screen.getByRole('img');
  });

  let hostElement: HTMLImageElement;

  it('has an accessible name', () => {
    expect(hostElement).toHaveAccessibleName('Energy Origin');
  });

  it('renders the product logo', () => {
    expect(hostElement).toHaveAttribute('src', expect.stringMatching(/\/energy-origin-logo.svg$/));
  });
});
