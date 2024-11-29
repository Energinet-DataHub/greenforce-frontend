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
