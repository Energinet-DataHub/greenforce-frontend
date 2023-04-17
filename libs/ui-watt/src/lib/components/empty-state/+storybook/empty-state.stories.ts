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
import {
  StoryObj,
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { WattEmptyStateComponent } from '../empty-state.component';
import { WattButtonModule } from '../../button';
import { StorybookEmptyStateOverviewComponent } from './storybook-empty-state-overview.component';

const meta: Meta<StorybookEmptyStateOverviewComponent> = {
  title: 'Components/Empty State',
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(HttpClientModule)],
    }),
    moduleMetadata({
      imports: [
        StorybookEmptyStateOverviewComponent,
        WattEmptyStateComponent,
        WattButtonModule,
      ],
    }),
  ],
  component: StorybookEmptyStateOverviewComponent,
};

export default meta;

export const Overview: StoryObj<StorybookEmptyStateOverviewComponent> = {
  render: (args) => ({
    props: args,
  }),
};

const emptyStateWithCallBackTemplate = (
  args: Partial<WattEmptyStateComponent>
) => `<watt-empty-state icon="${args.icon}" title="${args.title}" message="${args.message}">
  <watt-button variant="primary" size="normal">Go Back</watt-button>
</watt-empty-state>`;

export const WithCallToAction: StoryObj<WattEmptyStateComponent> = {
  render: (args) => ({
    props: args,
    template: emptyStateWithCallBackTemplate(args),
  }),

  args: {
    icon: 'power',
    title: 'An unexpected error occured',
    message:
      'Try again or contact your system administrator if you keep getting this error.',
  },

  parameters: {
    docs: {
      source: {
        code: emptyStateWithCallBackTemplate(WithCallToAction.args),
      },
    },
  },
};

const withoutIconTemplate = (args: Partial<WattEmptyStateComponent>) =>
  `<watt-empty-state title="${args.title}" message="${args.message}"></watt-empty-state>`;

export const WithoutIcon: StoryObj<WattEmptyStateComponent> = {
  render: (args) => ({
    props: args,
    template: withoutIconTemplate(args),
  }),

  args: {
    title: 'No results for ‘test’',
    message:
      'Try adjusting your search or filter to find what you are looking for.',
  },

  parameters: {
    docs: {
      source: {
        code: withoutIconTemplate(WithoutIcon.args),
      },
    },
  },
};

const smallTemplate = (args: Partial<WattEmptyStateComponent>) =>
  `<watt-empty-state size="small" title="${args.title}" message="${args.message}"></watt-empty-state>`;

export const Small: StoryObj<WattEmptyStateComponent> = {
  render: (args) => ({
    props: args,
    template: smallTemplate(args),
  }),

  args: {
    icon: undefined,
    title: 'No results for ‘test’',
    message:
      'Try adjusting your search or filter to find what you are looking for.',
  },

  parameters: {
    docs: {
      source: {
        code: smallTemplate(Small.args),
      },
    },
  },
};
