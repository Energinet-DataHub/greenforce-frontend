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
import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

import { WATT_CARD } from '../../card';
import { VATER } from '../../vater';
import { WattButtonComponent } from '../../button';
import { WattSpinnerComponent } from '../index';

const meta: Meta<WattSpinnerComponent> = {
  title: 'Components/Spinner',
  decorators: [
    moduleMetadata({
      imports: [WattSpinnerComponent, WattButtonComponent, WATT_CARD, VATER],
    }),
  ],
  component: WattSpinnerComponent,
  argTypes: {
    diameter: {
      control: { type: 'number', min: 12, max: 96, step: 2 },
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
    },
  },
};

export default meta;

export const Spinner: StoryFn<WattSpinnerComponent> = (args) => ({
  props: args,
  template: `<watt-spinner [diameter]="diameter" [strokeWidth]="strokeWidth" />`,
});
Spinner.args = {
  diameter: 44,
  strokeWidth: 5,
};

export const Sizes: StoryFn = () => ({
  template: `
    <vater-stack direction="row" gap="m" align="center">
      <vater-stack gap="s" align="center">
        <watt-spinner [diameter]="18" [strokeWidth]="4" />
        <span>18px</span>
      </vater-stack>
      <vater-stack gap="s" align="center">
        <watt-spinner [diameter]="24" [strokeWidth]="4" />
        <span>24px</span>
      </vater-stack>
      <vater-stack gap="s" align="center">
        <watt-spinner [diameter]="44" [strokeWidth]="5" />
        <span>44px</span>
      </vater-stack>
      <vater-stack gap="s" align="center">
        <watt-spinner [diameter]="64" [strokeWidth]="6" />
        <span>64px</span>
      </vater-stack>
    </vater-stack>
  `,
});

export const StrokeWidths: StoryFn = () => ({
  template: `
    <vater-stack direction="row" gap="m" align="center">
      <vater-stack gap="s" align="center">
        <watt-spinner [strokeWidth]="2" />
        <span>2px</span>
      </vater-stack>
      <vater-stack gap="s" align="center">
        <watt-spinner [strokeWidth]="5" />
        <span>5px</span>
      </vater-stack>
      <vater-stack gap="s" align="center">
        <watt-spinner [strokeWidth]="8" />
        <span>8px</span>
      </vater-stack>
    </vater-stack>
  `,
});

export const InButtons: StoryFn = () => ({
  template: `
    <vater-stack direction="row" gap="m" align="center">
      <watt-button [loading]="true">Primary</watt-button>
      <watt-button variant="secondary" [loading]="true">Secondary</watt-button>
      <watt-button variant="primary" icon="plus" [loading]="true">Leading icon</watt-button>
      <watt-button variant="secondary" icon="plus" iconPosition="trailing" [loading]="true">
        Trailing icon
      </watt-button>
      <watt-button variant="icon" icon="plus" [loading]="true" aria-label="Loading action" />
    </vater-stack>
  `,
});
