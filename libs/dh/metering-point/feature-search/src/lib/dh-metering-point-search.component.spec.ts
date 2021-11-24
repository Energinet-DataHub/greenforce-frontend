/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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

import { getTranslocoTestingModule } from '@energinet-datahub/dh/globalization/configuration-localization';

import {
  DhMeteringPointSearchComponent,
  DhMeteringPointSearchScam,
} from './dh-metering-point-search.component';

describe(DhMeteringPointSearchComponent.name, () => {
  beforeEach(async () => {
    await render(DhMeteringPointSearchComponent, {
      imports: [getTranslocoTestingModule(), DhMeteringPointSearchScam],
    });
  });

  it('should show heading of level 1', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should redirect to overview, if metering point is found', () => {});

  it('should show empty state if no metering point is found', () => {});

  it('should show error if request failed', () => {});
});
