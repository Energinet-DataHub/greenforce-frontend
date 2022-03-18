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
  EoInlineMessageComponent,
  EoInlineMessageScam,
} from './eo-inline-message.component';
import { render, screen } from '@testing-library/angular';

describe(`${EoInlineMessageComponent.name} - Component API, Content projection`, () => {
  it('Inserts an image content into the ng-content "icon" slot', async () => {
    await render(
      `<eo-inline-message><img src="" icon alt="EnergyOrigin"/></eo-inline-message>`,
      {
        imports: [EoInlineMessageScam],
      }
    );
    expect(await screen.findByRole('img', { name: /energyorigin/i })).toBeInTheDocument()
  });

  it('Inserts content into the ng-content "content" slot', async () => {
    await render(
      `<eo-inline-message><p content>Content</p></eo-inline-message>`,
      {
        imports: [EoInlineMessageScam],
      }
    );
    expect(await screen.findByText('Content')).toBeInTheDocument();
  });
});
