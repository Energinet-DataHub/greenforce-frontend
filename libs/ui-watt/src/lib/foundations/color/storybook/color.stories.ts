import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { ColorComponent } from './color.component';

export default {
  title: 'Foundations/Color',
  component: ColorComponent,
  decorators: [
    moduleMetadata({
      imports: [MatTableModule, MatCardModule],
      providers: [
        { provide: Window, useValue: window }
      ]
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
  color: watt.getColor('COLOR NAME-contrast');
}

// Usage from TypeScript:
1. import { Colors, ColorHelperService } from '@energinet/watt';      
1. Inject the ColorHelperService
2. Use ColorHelperService.getColor(Colors.COLOR NAME);
`,
      language: 'sass'
    },
  },
}
