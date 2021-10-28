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
import { EmptyStateOverviewComponent } from './storybook-empty-state-overview.component';
import { WattButtonModule } from '../../button/watt-button.module';

export default {
  title: 'Components/Empty State',
  decorators: [
    moduleMetadata({
      imports: [WattEmptyStateModule, WattButtonModule],
    }),
  ],
  component: EmptyStateOverviewComponent,
} as Meta<EmptyStateOverviewComponent>;

export const overview: Story<EmptyStateOverviewComponent> = (args) => ({
  props: args,
});

const emptyStateWithCallBackTemplate = (
  args: Partial<WattEmptyStateComponent>
) => `<watt-empty-state icon="${args.icon}" title="${args.title}" message="${args.message}">
  <watt-button type="primary" size="normal">Go Back</watt-button>
</watt-empty-state>`;

export const withCallToAction: Story<WattEmptyStateComponent> = (args) => ({
  props: args,
  template: emptyStateWithCallBackTemplate(args),
});
withCallToAction.args = {
  icon: 'power',
  title: 'An unexpected error occured',
  message:
    'Try again or contact your system administrator if you keep getting this error.',
};
withCallToAction.parameters = {
  docs: {
    source: {
      code: emptyStateWithCallBackTemplate(withCallToAction.args),
    },
  },
};

const withoutIconTemplate = (args: Partial<WattEmptyStateComponent>) =>
  `<watt-empty-state title="${args.title}" message="${args.message}"></watt-empty-state>`;

export const withoutIcon: Story<WattEmptyStateComponent> = (args) => ({
  props: args,
  template: withoutIconTemplate(args),
});
withoutIcon.args = {
  title: 'No results for ‘test’',
  message:
    'Try adjusting your search or filter to find what you are looking for.',
};
withoutIcon.parameters = {
  docs: {
    source: {
      code: withoutIconTemplate(withoutIcon.args),
    },
  },
};

const smallTemplate = (args: Partial<WattEmptyStateComponent>) =>
  `<watt-empty-state size="small" title="${args.title}" message="${args.message}"></watt-empty-state>`;

export const small: Story<WattEmptyStateComponent> = (args) => ({
  props: args,
  template: smallTemplate(args),
});
small.args = {
  icon: undefined,
  title: 'No results for ‘test’',
  message:
    'Try adjusting your search or filter to find what you are looking for.',
};

small.parameters = {
  docs: {
    source: {
      code: smallTemplate(small.args),
    },
  },
};
