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

import { VaterStackComponent } from '../../vater/vater-stack.component';
import { WattSeparatorComponent } from '../watt-separator.component';

const meta: Meta<WattSeparatorComponent> = {
  title: 'Components/Separator',
  component: WattSeparatorComponent,
};

export default meta;

export const Regular: StoryFn<WattSeparatorComponent> = () => ({
  template: `
    <p>Content above</p>
    <watt-separator size="regular" />
    <p>Content below</p>
  `,
});

export const Bold: StoryFn<WattSeparatorComponent> = () => ({
  template: `
    <p>Content above</p>
    <watt-separator size="bold" />
    <p>Content below</p>
  `,
});

export const VerticalRegular: StoryFn<WattSeparatorComponent> = () => ({
  template: `
    <vater-stack gap="m" direction="row" style="height: 200px">
      <span>Left content</span>
      <watt-separator orientation="vertical" size="regular" />
      <span>Right content</span>
    </vater-stack>
  `,
});
VerticalRegular.decorators = [moduleMetadata({ imports: [VaterStackComponent] })];

export const VerticalBold: StoryFn<WattSeparatorComponent> = () => ({
  template: `
    <vater-stack gap="m" direction="row" style="height: 200px">
      <span>Left content</span>
      <watt-separator orientation="vertical" size="bold" />
      <span>Right content</span>
    </vater-stack>
  `,
});
VerticalBold.decorators = [moduleMetadata({ imports: [VaterStackComponent] })];
