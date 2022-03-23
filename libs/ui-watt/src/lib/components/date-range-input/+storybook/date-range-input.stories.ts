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
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DhConfigurationLocalizationRootModule } from '@energinet-datahub/dh/globalization/configuration-localization';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattDateRangeInputComponent } from '../date-range-input.component';
import { WattDateRangeInputModule } from '../date-range-input.module';

export default {
  title: 'Components/Date Input Range',
  decorators: [
    moduleMetadata({
      imports: [
        WattDateRangeInputModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        DhConfigurationLocalizationRootModule,
      ],
    }),
  ],
  component: WattDateRangeInputComponent,
} as Meta<WattDateRangeInputComponent>;

export const overview: Story<WattDateRangeInputComponent> = (args) => ({
  props: args,
  template: `
   <watt-form-field>
    <watt-label>Date range</watt-label>
    <watt-date-range-input></watt-date-range-input>
   </watt-form-field>
   `,
});
overview.parameters = {
  docs: {
    source: {
      code: 'Nothing to see here.',
    },
  },
};

overview.argTypes = {
  min: {
    description:
      'Minimum value. This needs to be in the same format as the `dd-mm-yyyy`',
  },
  max: {
    description:
      'Maximum value. This needs to be in the same format as the `dd-mm-yyyy`',
  },
};
