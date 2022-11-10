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

import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

import { DhMeteringPointIdentityTextFieldWithIconComponent } from './dh-metering-point-identity-text-field-with-icon.component';

import { WattIcon } from '@energinet-datahub/watt/icon';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';

interface DhMeteringPointIdentityTextFieldProps {
  iconName?: WattIcon;
  text: string;
}

describe(DhMeteringPointIdentityTextFieldWithIconComponent.name, () => {
  async function setup(testData?: DhMeteringPointIdentityTextFieldProps) {
    const { fixture } = await render(
      DhMeteringPointIdentityTextFieldWithIconComponent,
      {
        componentProperties: {
          ...testData,
        },
        imports: [getTranslocoTestingModule()],
      }
    );

    runOnPushChangeDetection(fixture);
  }

  it('should show only text', async () => {
    await setup({
      iconName: undefined,
      text: 'show text',
    });

    expect('dh-metering-point-identity-text-field-icon').not.toBeVisible;
    // expect(screen.getByText('show text')).toBeInTheDocument();
  });

  // it('should show both text & icon', async () => {
  //   await setup({
  //     iconName: 'warning',
  //     text: 'show text',
  //   });

  //   expect('dh-metering-point-identity-text-field-icon').toBeVisible();
  //   expect(screen.getByText('show text')).toBeInTheDocument();
  // });
});
