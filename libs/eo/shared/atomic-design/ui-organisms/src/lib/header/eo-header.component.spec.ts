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
import { EoHeaderComponent } from './eo-header.component';

describe(EoHeaderComponent.name, () => {
  const findEnergyOriginLogo = () => screen.findByRole('img', { name: 'Energy Origin' });

  it('displays the Energy Origin logo', async () => {
    await render(EoHeaderComponent, {
      imports: [EoHeaderComponent],
    });
    expect(await findEnergyOriginLogo()).toBeInTheDocument();
  });

  it('Inserts content into ng-content', async () => {
    await render(`<eo-header><p>test</p></eo-header>`, {
      imports: [EoHeaderComponent],
    });
    expect(await screen.findByText('test')).toBeInTheDocument();
  });
});
