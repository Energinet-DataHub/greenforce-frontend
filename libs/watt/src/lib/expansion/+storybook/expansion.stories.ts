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
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { WattExpansionComponent } from './../index';
import { provideAnimations } from '@angular/platform-browser/animations';

const meta: Meta<WattExpansionComponent> = {
  title: 'Components/Expansion Panel',
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [WattExpansionComponent],
    }),
  ],
  component: WattExpansionComponent,
};

export default meta;

const template: StoryFn<WattExpansionComponent> = (args) => ({
  props: args,
  template: `<watt-expansion openLabel="${args.openLabel}" closeLabel="${args.closeLabel}" expanded="${args.expanded}">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
  </watt-expansion>`,
});

export const Collapsed = template.bind({});
Collapsed.parameters = {
  docs: {
    source: {
      code: '<watt-expansion openLabel="Show more" closeLabel="Show less">YOUR AMAZING CONTENT</watt-expansion>',
    },
  },
};
Collapsed.args = {
  openLabel: 'Show more',
  closeLabel: 'Show less',
  expanded: false,
};

export const Expanded = template.bind({});
Expanded.args = {
  openLabel: 'Show more',
  closeLabel: 'Show less',
  expanded: true,
};
Expanded.parameters = {
  docs: {
    source: {
      code: '<watt-expansion openLabel="Show more" closeLabel="Show less" expanded="true">YOUR AMAZING CONTENT</watt-expansion>',
    },
  },
};
