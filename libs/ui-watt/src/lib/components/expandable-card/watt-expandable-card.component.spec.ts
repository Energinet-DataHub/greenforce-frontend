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
import {
  WattExpandableCardComponent,
  WATT_EXPANDABLE_CARD_COMPONENTS,
} from './watt-expandable-card.component';

const template = `
  <watt-expandable-card [expanded]="expanded">
    <watt-expandable-card-title>Title</watt-expandable-card-title>
    <p>Body</p>
  </watt-expandable-card>
`;

describe(WattExpandableCardComponent.name, () => {
  async function setup(args: Partial<WattExpandableCardComponent>) {
    await render(template, {
      componentProperties: args,
      imports: [WATT_EXPANDABLE_CARD_COMPONENTS],
    });
  }

  it('renders collapsed', async () => {
    await setup({ expanded: false });
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
  });

  it('renders expanded', async () => {
    await setup({ expanded: true });
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
  });
});
