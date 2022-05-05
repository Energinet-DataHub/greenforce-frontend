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

import {
  WattValidationMessageComponent,
  WattValidationMessageType,
} from './watt-validation-message.component';
import { WattValidationMessageModule } from './watt-validation-message.module';

describe(WattValidationMessageComponent.name, () => {
  it('exports shared Watt Design System validation message', async () => {
    const label = 'Error';
    const message = 'The metering point is not active';
    const type: WattValidationMessageType = 'danger';

    const view = await render(
      `
      <watt-validation-message label="${label}" message="${message}" type="${type}">
      </watt-validation-message>
    `,
      {
        imports: [WattValidationMessageModule],
      }
    );
    const expectedVariable = `${label}:`;

    expect(view.queryByText(expectedVariable)).not.toBeNull();
    expect(view.queryByText(message)).not.toBeNull();
  });
});
