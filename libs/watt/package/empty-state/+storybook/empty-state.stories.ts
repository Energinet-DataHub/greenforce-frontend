//#region License
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
//#endregion
import { applicationConfig, Meta, moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { WattEmptyStateComponent } from '../watt-empty-state.component';
import { WattButtonComponent } from '../../button';
import { StorybookEmptyStateOverviewComponent } from './storybook-empty-state-overview.component';

const meta: Meta<StorybookEmptyStateOverviewComponent> = {
  title: 'Components/Empty State',
  decorators: [
    applicationConfig({
      providers: [provideHttpClient(withInterceptorsFromDi())],
    }),
    moduleMetadata({
      imports: [StorybookEmptyStateOverviewComponent, WattEmptyStateComponent, WattButtonComponent],
    }),
  ],
  component: StorybookEmptyStateOverviewComponent,
};

export default meta;

export const Overview: StoryFn<StorybookEmptyStateOverviewComponent> = (args) => ({
  props: args,
});

const emptyStateWithCallBackTemplate = ({
  args,
}: StoryObj<WattEmptyStateComponent>) => `<watt-empty-state icon="${args?.icon}" title="${args?.title}" message="${args?.message}">
  <watt-button variant="primary" size="normal">Go Back</watt-button>
</watt-empty-state>`;

export const WithCallToAction: StoryFn<WattEmptyStateComponent> = (args) => ({
  props: args,
  template: emptyStateWithCallBackTemplate({ args }),
});
WithCallToAction.args = {
  icon: 'power',
  title: 'An unexpected error occured',
  message: 'Try again or contact your system administrator if you keep getting this error.',
};
WithCallToAction.parameters = {
  docs: {
    source: {
      code: emptyStateWithCallBackTemplate({ args: WithCallToAction.args }),
    },
  },
};

const withoutIconTemplate = ({ args }: StoryObj<WattEmptyStateComponent>) =>
  `<watt-empty-state title="${args?.title}" message="${args?.message}" />`;

export const WithoutIcon: StoryFn<WattEmptyStateComponent> = (args) => ({
  props: args,
  template: withoutIconTemplate({ args }),
});
WithoutIcon.args = {
  title: 'No results for ‘test’',
  message: 'Try adjusting your search or filter to find what you are looking for.',
};
WithoutIcon.parameters = {
  docs: {
    source: {
      code: withoutIconTemplate({ args: WithoutIcon.args }),
    },
  },
};

const smallTemplate = ({ args }: StoryObj<WattEmptyStateComponent>) =>
  `<watt-empty-state size="small" title="${args?.title}" message="${args?.message}" />`;

export const Small: StoryFn<WattEmptyStateComponent> = (args) => ({
  props: args,
  template: smallTemplate({ args }),
});
Small.args = {
  icon: undefined,
  title: 'No results for ‘test’',
  message: 'Try adjusting your search or filter to find what you are looking for.',
};

Small.parameters = {
  docs: {
    source: {
      code: smallTemplate({ args: Small.args }),
    },
  },
};
