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
import {
  dhMeteringPointIdParam,
  DhMeteringPointOverviewGuard,
  dhMeteringPointPath,
} from '@energinet-datahub/dh/metering-point/routing';
import { render, RenderResult, screen } from '@testing-library/angular';
import { SpectacularAppComponent } from '@ngworker/spectacular';

import {
  DhMeteringPointOverviewComponent,
  DhMeteringPointOverviewScam,
} from './dh-metering-point-overview.component';

describe(DhMeteringPointOverviewComponent.name, () => {
  beforeEach(async () => {
    view = await render(SpectacularAppComponent, {
      imports: [DhMeteringPointOverviewScam],
      routes: [
        {
          path: dhMeteringPointPath,
          children: [
            {
              canActivate: [DhMeteringPointOverviewGuard],
              component: DhMeteringPointOverviewComponent,
              path: `:${dhMeteringPointIdParam}`,
            },
          ],
        },
      ],
    });
  });

  let view: RenderResult<SpectacularAppComponent>;
  const meteringPointId = '571313180400014077';

  it('displays a link to the Metering point URL', async () => {
    await view.navigate(`/${dhMeteringPointPath}/${meteringPointId}`);

    const [topLevelLink]: HTMLAnchorElement[] = await screen.findAllByRole(
      'link'
    );
    const actualUrl = new URL(topLevelLink.href);

    expect(actualUrl.pathname).toBe(`/${dhMeteringPointPath}`);
  });

  it('displays the metering point id from the URL in a heading', async () => {
    await view.navigate(`/${dhMeteringPointPath}/${meteringPointId}`);

    const heading: HTMLHeadingElement = await screen.findByRole('heading');

    expect(heading.textContent).toBe(meteringPointId);
  });
});
