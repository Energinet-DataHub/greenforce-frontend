/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { ColorComponent } from './color.component';
import { ColorModule } from './color.module';

export default {
  title: 'Foundations/Color',
  component: ColorComponent,
  decorators: [
    moduleMetadata({
      imports: [ColorModule],
    }),
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
      code: ` // Usage from SCSS / CSS (tip: hover over the color sample, and click to copy to clipboard):
.my-element {
  background: var(<color-variable>);
}

// Usage from TypeScript:
1. import { Colors, ColorHelperService } from '@energinet/watt';      
2. Inject the ColorHelperService
3. Use ColorHelperService.getColor(Colors.<color-name>);
`,
    },
  },
};
