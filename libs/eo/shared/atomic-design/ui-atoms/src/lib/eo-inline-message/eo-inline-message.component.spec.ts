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
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { render, screen } from '@testing-library/angular';

import { EoInlineMessageComponent } from './eo-inline-message.component';

describe(`${EoInlineMessageComponent.name} component API`, () => {
  it('projects a Watt Icon', async () => {
    // Arrange
    await render(
      `<eo-inline-message><watt-icon name="custom-primary-info" label="Test icon"></watt-icon></eo-inline-message>`,
      {
        imports: [EoInlineMessageComponent, WattIconModule],
      }
    );

    // Act

    // Assert
    expect(
      await screen.findByRole('img', { name: /test icon/i })
    ).toBeInTheDocument();
  });

  it('projects content', async () => {
    // Arrange
    await render(`<eo-inline-message><p>Test content</p></eo-inline-message>`, {
      imports: [EoInlineMessageComponent],
    });

    // Act

    // Assert
    expect(await screen.findByText(/test content/i)).toBeInTheDocument();
  });
});
