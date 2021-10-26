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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattExpansionComponent, WattExpansionModule } from './../index';

export default {
  title: 'Components/Expansion Panel',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, WattExpansionModule],
    }),
  ],
  component: WattExpansionComponent,
} as Meta<WattExpansionComponent>;

const template: Story<WattExpansionComponent> = (args) => ({
  props: args,
  template: `<watt-expansion openLabel="${args.openLabel}" closeLabel="${args.closeLabel}" expanded="${args.expanded}">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
  </watt-expansion>`,
});

export const collapsed = template.bind({});
collapsed.parameters = {
  docs: {
    source: {
      code: '<watt-expansion openLabel="Show more" closeLabel="Show less">YOUR AMAZING CONTENT</watt-expansion>',
    },
  },
};
collapsed.args = {
  openLabel: 'Show more',
  closeLabel: 'Show less',
  expanded: false,
};

export const expanded = template.bind({});
expanded.args = {
  openLabel: 'Show more',
  closeLabel: 'Show less',
  expanded: true,
};
expanded.parameters = {
  docs: {
    source: {
      code: '<watt-expansion openLabel="Show more" closeLabel="Show less" expanded="true">YOUR AMAZING CONTENT</watt-expansion>',
    },
  },
};
