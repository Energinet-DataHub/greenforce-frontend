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

import { WattCardModule } from './watt-card.module';
import { WattCardComponent } from './watt-card.component';

describe(WattCardComponent.name, () => {
  it('renders card title', async () => {
    await render(
      `
      <watt-card>
        <watt-card-title>
          <h3>Card title</h3>
        </watt-card-title>

        Card content
      </watt-card>
    `,
      {
        imports: [WattCardModule],
      }
    );

    expect(screen.getByText('Card title')).toBeInTheDocument();
  });

  it('renders card content', async () => {
    await render(
      `
      <watt-card>
        Card content
      </watt-card>
    `,
      {
        imports: [WattCardModule],
      }
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
});
