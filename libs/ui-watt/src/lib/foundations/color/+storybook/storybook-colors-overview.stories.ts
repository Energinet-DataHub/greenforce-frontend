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
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { StorybookColorsOverviewComponent } from './storybook-colors-overview.component';
import { StorybookColorsOverviewModule } from './storybook-colors-overview.module';

export default {
  title: 'Foundations/Colors',
  component: StorybookColorsOverviewComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookColorsOverviewModule],
    }),
  ],
} as Meta<StorybookColorsOverviewComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<StorybookColorsOverviewComponent> = (args) => ({
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
