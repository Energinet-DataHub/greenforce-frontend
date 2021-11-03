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
import { render } from '@testing-library/angular';

import { WattButtonModule } from './watt-button.module';

describe(WattButtonModule.name, () => {
  it('exports shared Watt Design System buttons', async () => {
    const text = 'Primary button';

    const view = await render(
      `
      <watt-button type="primary">
        ${text}
      </watt-button>
    `,
      {
        imports: [WattButtonModule],
      }
    );

    expect(view.queryByText(text)).not.toBeNull();
  });
});
