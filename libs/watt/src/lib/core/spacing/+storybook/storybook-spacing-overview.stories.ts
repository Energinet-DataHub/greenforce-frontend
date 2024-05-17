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
import { StoryFn, Meta } from '@storybook/angular';

import { StorybookSpacingOverviewComponent } from './storybook-spacing-overview.component';

const meta: Meta<StorybookSpacingOverviewComponent> = {
  title: 'Foundations/Spacing',
  component: StorybookSpacingOverviewComponent,
};

export default meta;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<StorybookSpacingOverviewComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Spacing = Template.bind({});
