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
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { WattCopyToClipboardDirective } from '../watt-copy-to-clipboard.directive';
import { WattStorybookClipboardComponent } from './storybook-clipboard.component';

const meta: Meta<WattCopyToClipboardDirective> = {
  title: 'Components/Clipboard',
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(MatSnackBarModule), provideAnimations()],
    }),
    moduleMetadata({
      imports: [WattStorybookClipboardComponent],
    }),
  ],
};

export default meta;

export const Overview: StoryFn<WattCopyToClipboardDirective> = (args) => ({
  props: args,
  template: `<watt-storybook-clipboard></watt-storybook-clipboard>`,
});

Overview.parameters = {
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
};
