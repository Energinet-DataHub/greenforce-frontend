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

import { WattSliderComponent } from './watt-slider.component';
import { WattSliderModule } from './watt-slider.module';

export default {
  title: 'Components/Slider',
  component: WattSliderComponent,
  decorators: [
    moduleMetadata({
      imports: [WattSliderModule],
    }),
  ],
} as Meta<WattSliderComponent>;

export const Overview: Story<WattSliderComponent> = (args) => ({
  props: args,
});

Overview.args = {
  value: { min: 0, max: 100 },
};

export const TimePicker: Story<WattSliderComponent> = (args) => {
  return {
    props: {
      ...args,
      format: (x: number) => {
        const hours = x === 96 ? '23' : `${Math.floor(x / 4)}`;
        const minutes = x === 96 ? '59' : `${(x * 15) % 60}`;
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      },
    },
    template: `
      <watt-slider [(value)]="value"></watt-slider>
      <p>{{format(value.min)}} - {{format(value.max)}}</p>
    `,
  };
};

TimePicker.args = {
  max: 96,
  value: { min: 25, max: 75 },
};
