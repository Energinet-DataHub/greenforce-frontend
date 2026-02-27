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
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { WattButtonComponent } from '../../button';
import { WattTooltipDirective } from '../watt-tooltip.directive';

const meta: Meta = {
  title: 'Components/Tooltip',
  decorators: [
    moduleMetadata({
      imports: [WattTooltipDirective, WattButtonComponent],
    }),
  ],
};
export default meta;

export const Overview: StoryObj = {
  render: () => ({
    template: `<watt-button wattTooltip="Click me">Button</watt-button>`,
  }),
};

export const Positions: StoryObj = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5rem; padding: 5rem; padding-top: 8rem; justify-items: center; align-items: center;">
        <watt-button wattTooltip="top-start" wattTooltipPosition="top-start" wattTooltipAlwaysVisible>top-start</watt-button>
        <watt-button wattTooltip="top" wattTooltipPosition="top" wattTooltipAlwaysVisible>top</watt-button>
        <watt-button wattTooltip="top-end" wattTooltipPosition="top-end" wattTooltipAlwaysVisible>top-end</watt-button>

        <watt-button wattTooltip="left" wattTooltipPosition="left" wattTooltipAlwaysVisible>left</watt-button>
        <div></div>
        <watt-button wattTooltip="right" wattTooltipPosition="right" wattTooltipAlwaysVisible>right</watt-button>

        <watt-button wattTooltip="bottom-start" wattTooltipPosition="bottom-start" wattTooltipAlwaysVisible>bottom-start</watt-button>
        <watt-button wattTooltip="bottom" wattTooltipPosition="bottom" wattTooltipAlwaysVisible>bottom</watt-button>
        <watt-button wattTooltip="bottom-end" wattTooltipPosition="bottom-end" wattTooltipAlwaysVisible>bottom-end</watt-button>
      </div>
    `,
  }),
};

export const Variants: StoryObj = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 0; align-items: stretch;">
        <div style="padding: 5rem 8rem; display: flex; align-items: center; justify-content: center;">
          <watt-button wattTooltip="Dark variant" wattTooltipPosition="top" wattTooltipVariant="dark" wattTooltipAlwaysVisible>Dark</watt-button>
        </div>
        <div style="padding: 5rem 8rem; background: var(--watt-color-primary-dark); display: flex; align-items: center; justify-content: center;">
          <watt-button wattTooltip="Light variant" wattTooltipPosition="top" wattTooltipVariant="light" wattTooltipAlwaysVisible>Light</watt-button>
        </div>
      </div>
    `,
  }),
};
