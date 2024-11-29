import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { StorybookButtonOverviewComponent } from './+storybook/storybook-button-overview.component';
import { WattButtonComponent } from './watt-button.component';

const meta: Meta<WattButtonComponent> = {
  title: 'Components/Button',
  component: WattButtonComponent,
};

export default meta;

const howToUseGuide = `
1. Import ${WattButtonComponent.name} in a module
import { ${WattButtonComponent.name} } from '@energinet-datahub/watt/button';

2. Use <watt-button>Button</watt-button>
`;

export const Overview = () => ({
  template: '<storybook-button-overview></storybook-button-overview>',
});
Overview.decorators = [
  moduleMetadata({
    imports: [StorybookButtonOverviewComponent],
  }),
];
Overview.parameters = {
  docs: { source: { code: howToUseGuide } },
};

//👇 We create a “template” of how args map to rendering
const ButtonStory: StoryFn<WattButtonComponent> = (args) => ({
  props: args,
  template: `<watt-button>Button</watt-button>`,
});

export const Button = ButtonStory.bind({});
Button.args = {
  variant: 'primary',
};
