//#region License
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
//#endregion
import { render, screen } from '@testing-library/angular';
import { EttHeaderComponent } from './ett-header.component';

describe(EttHeaderComponent, () => {
  const findEnergyTrackAndTraceLogo = () => screen.findByRole('img', { name: 'Energy Track and Trace' });

  it('displays the Energy Track and Trace logo', async () => {
    await render(EttHeaderComponent);
    expect(await findEnergyTrackAndTraceLogo()).toBeInTheDocument();
  });

  it('Inserts content into ng-content', async () => {
    await render(`<ett-header><p>test</p></ett-header>`, {
      imports: [EttHeaderComponent],
    });
    expect(await screen.findByText('test')).toBeInTheDocument();
  });
});
