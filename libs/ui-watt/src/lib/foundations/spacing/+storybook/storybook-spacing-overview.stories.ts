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

import { StorybookSpacingOverviewComponent } from './storybook-spacing-overview.component';
import { StorybookSpacingOverviewModule } from './storybook-spacing-overview.module';
import StorybookSpacingOverviewDocs from './storybook-spacing-overview.mdx';

const emptySourceCodeBlock = ' ';

export default {
  title: 'Foundations/Spacing',
  component: StorybookSpacingOverviewComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookSpacingOverviewModule],
    }),
  ],
  parameters: {
    docs: {
      page: StorybookSpacingOverviewDocs,
      source: {
        code: emptySourceCodeBlock,
      },
    },
  },
} as Meta<StorybookSpacingOverviewComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<StorybookSpacingOverviewComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Spacing = Template.bind({});
