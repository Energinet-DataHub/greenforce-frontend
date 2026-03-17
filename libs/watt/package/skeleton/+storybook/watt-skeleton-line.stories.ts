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
import { Meta, StoryFn, StoryObj, moduleMetadata } from '@storybook/angular';

import { WATT_CARD } from '@energinet/watt/card';
import { WattSkeletonLineComponent } from '../index';

const meta: Meta<WattSkeletonLineComponent> = {
  title: 'Components/Skeleton',
  decorators: [
    moduleMetadata({
      imports: [WattSkeletonLineComponent, WATT_CARD],
    }),
  ],
  component: WattSkeletonLineComponent,
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<WattSkeletonLineComponent>;

export const Default: Story = {
  args: {
    width: '100%',
    height: '1em',
    borderRadius: '4px',
  },
};

export const CustomSize: Story = {
  args: {
    width: '200px',
    height: '20px',
    borderRadius: '4px',
  },
};

export const Pill: Story = {
  args: {
    width: '120px',
    height: '24px',
    borderRadius: '50px',
  },
};

export const MultipleLines: StoryFn = () => ({
  template: `
    <div style="display: flex; flex-direction: column; gap: var(--watt-space-s); width: 300px;">
      <watt-skeleton-line width="80%" height="1em" />
      <watt-skeleton-line width="100%" height="1em" />
      <watt-skeleton-line width="60%" height="1em" />
    </div>
  `,
});

export const CardPlaceholder: StoryFn = () => ({
  template: `
    <watt-card style="width: 320px;">
      <div style="display: flex; flex-direction: column; gap: var(--watt-space-m);">
        <watt-skeleton-line width="40%" height="1.5em" />
        <watt-skeleton-line width="100%" height="1em" />
        <watt-skeleton-line width="100%" height="1em" />
        <watt-skeleton-line width="70%" height="1em" />
        <watt-skeleton-line width="90px" height="32px" />
      </div>
    </watt-card>
  `,
});


