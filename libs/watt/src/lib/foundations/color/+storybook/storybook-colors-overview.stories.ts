import { StoryFn, Meta } from '@storybook/angular';

import { StorybookColorsOverviewComponent } from './storybook-colors-overview.component';

const meta: Meta<StorybookColorsOverviewComponent> = {
  title: 'Foundations/Colors',
  component: StorybookColorsOverviewComponent,
};

export default meta;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<StorybookColorsOverviewComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Colors = Template.bind({});
Colors.parameters = {
  docs: {
    source: {
      code: `// Usage from SCSS / CSS (tip: hover over the color sample, and click to copy to clipboard):
.my-element {
  background: var(<color-variable>);
}

// Usage from TypeScript:
1. import { WattColor, WattColorHelperService } from '@energinet-datahub/watt/color';
2. Inject the WattColorHelperService
3. Use WattColorHelperService.getColor(WattColor.<color-name>);
`,
    },
  },
};
