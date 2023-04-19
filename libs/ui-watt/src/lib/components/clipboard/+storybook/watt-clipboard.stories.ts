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
import { provideAnimations } from '@angular/platform-browser/animations';
import { StoryObj, moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';

import { WattCopyToClipboardDirective } from '../watt-copy-to-clipboard.directive';
import { WattToastModule } from '../../toast/watt-toast.module';
import { WattStorybookClipboardComponent } from './storybook-clipboard.component';

const meta: Meta<WattCopyToClipboardDirective> = {
  title: 'Components/Clipboard',
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(WattToastModule.forRoot()), provideAnimations()],
    }),
    moduleMetadata({
      imports: [WattStorybookClipboardComponent],
    }),
  ],
};

export default meta;

export const Overview: StoryObj<WattCopyToClipboardDirective> = {
  render: (args) => ({
    props: args,
    template: `<watt-storybook-clipboard></watt-storybook-clipboard>`,
  }),

  parameters: {
    docs: {
      source: {
        code: `
          <span
            [wattCopyToClipboard]="hunter2"
            wattTooltip="Copy password"
            wattTooltipPosition="above"
          >*******</span>
        `,
      },
    },
  },
};
