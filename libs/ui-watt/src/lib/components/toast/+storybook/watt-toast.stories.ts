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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { WattToastComponent } from '../watt-toast.component';
import { StorybookToastModule } from './storybook-toast.component';

export default {
  title: 'Components/Toast',
  component: WattToastComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookToastModule, BrowserAnimationsModule],
    }),
  ],
} as Meta<WattToastComponent>;

export const Overview: Story<WattToastComponent> = (args) => ({
  props: args,
  template: `<storybook-toast></storybook-toast>`,
});

Overview.args = {};
