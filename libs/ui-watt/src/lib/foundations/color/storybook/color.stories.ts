import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { ColorComponent } from './color.component';
import { ColorModule } from './color.module';

export default {
  title: 'Foundations/Color',
  component: ColorComponent,
  decorators: [
    moduleMetadata({
      imports: [ColorModule],
    })
  ],
} as Meta<ColorComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<ColorComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Color = Template.bind({});
Color.parameters = {
  docs: {
    source: {
      code: ` // Usage from SCSS:
@use '@energinet/watt' as watt;
.my-element {
  background: watt.getColor('COLOR NAME');
  color: watt.getColorContrast('COLOR NAME-contrast');
}

// Usage from TypeScript:
1. import { Colors, ColorHelperService } from '@energinet/watt';      
1. Inject the ColorHelperService
2. Use ColorHelperService.getColor(Colors.COLOR NAME); or ColorHelperService.getColorContrast(Colors.COLOR NAME);
`,
      language: 'sass'
    },
  },
}
