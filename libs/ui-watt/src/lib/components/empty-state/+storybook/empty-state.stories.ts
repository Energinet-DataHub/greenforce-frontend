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
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattEmptyStateComponent, WattEmptyStateModule } from './../index';

export default {
  title: 'Components/Empty State',
  decorators: [
    moduleMetadata({
      imports: [WattEmptyStateModule],
    }),
  ],
  component: WattEmptyStateComponent,
} as Meta<WattEmptyStateComponent>;

export const emptyState: Story<WattEmptyStateComponent> = (args) => ({
  props: args,
});
emptyState.args = {
  icon: 'explore',
  title: 'No results for ‘test’',
  msg: 'Try adjusting your search or filter to find what you are looking for.',
};

const emptyStateWithCallBackTemplate = (
  args: Partial<WattEmptyStateComponent>
) => `<watt-empty-state icon="${args.icon}" title="${args.title}" msg="${args.msg}">
  <watt-button type="primary" size="normal">Go Back</watt-button>
</watt-empty-state>`;

export const emptyStateWithCallBack: Story<WattEmptyStateComponent> = (
  args
) => ({
  props: args,
  template: emptyStateWithCallBackTemplate(args),
});
emptyStateWithCallBack.args = {
  icon: 'power',
  title: 'An unexpected error occured',
  msg: 'Try again or contact your system administrator if you keep getting this error.',
};
emptyStateWithCallBack.parameters = {
  docs: {
    source: {
      code: emptyStateWithCallBackTemplate(emptyStateWithCallBack.args),
    },
  },
};
