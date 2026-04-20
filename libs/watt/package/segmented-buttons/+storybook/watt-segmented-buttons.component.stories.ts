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
import { provideRouter } from '@angular/router';
import { Meta, applicationConfig, moduleMetadata, StoryObj } from '@storybook/angular';

import { WattStorybookSegmentedButtonsShowcaseComponent } from './storybook-segmented-buttons-showcase.component';

const meta: Meta<WattStorybookSegmentedButtonsShowcaseComponent> = {
  title: 'Components/Segmented buttons',
  component: WattStorybookSegmentedButtonsShowcaseComponent,
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({ imports: [WattStorybookSegmentedButtonsShowcaseComponent] }),
  ],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable the overview segmented buttons group',
    },
  },
  args: {
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<WattStorybookSegmentedButtonsShowcaseComponent>;

export const Overview: Story = {
  render: (args) => ({
    props: args,
    template: `<watt-storybook-segmented-buttons-showcase [disabled]="disabled" />`,
  }),
};
