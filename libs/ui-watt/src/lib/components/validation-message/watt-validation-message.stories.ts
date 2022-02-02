import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattValidationMessageComponent } from './watt-validation-message.component';
import { WattValidationMessageModule } from './watt-validation-message.module';

export default {
  title: 'Components/Validation message',
  component: WattValidationMessageComponent,
  decorators: [
    moduleMetadata({
      imports: [WattValidationMessageModule],
    }),
  ],
} as Meta<WattValidationMessageComponent>;

const howToUseGuideBasic = `
How to use

1. Import ${WattValidationMessageModule.name} in a module

import { ${WattValidationMessageModule.name} } from '@energinet-datahub/watt';

2. Use the component

<watt-validation-message label="Label" message="Message" type="danger"></watt-validation-message>`;

export const overview: Story<WattValidationMessageComponent> = (args) => ({
  props: args,
});
overview.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};
overview.args = {
  label: 'Info:',
  message: 'The metering point is not active',
  type: 'info',
};
