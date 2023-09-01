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
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { VaterStackComponent } from './vater-stack.component';
import { VaterFlexComponent } from './vater-flex.component';
import { VaterSpacerComponent } from './vater-spacer.component';

const meta: Meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Vater',
  decorators: [
    moduleMetadata({
      imports: [VaterStackComponent, VaterFlexComponent, VaterSpacerComponent],
    }),
  ],
};

export default meta;

export const Stack: StoryObj<VaterStackComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <vater-flex direction="row" gap="m" style="height: 400px; padding-top: var(--watt-space-l)">
        <vater-stack gap="s" style="width: 50%; padding: var(--watt-space-s); border: 1px dashed var(--watt-color-neutral-grey-500)">
          <code style="position: absolute; align-self: flex-start; transform: translateY(calc(-100% - var(--watt-space-m)))">direction="column"</code>
          <div style="background-color: var(--watt-color-primary-dark); width: 200px; height: 60px;"></div>
          <div style="background-color: var(--watt-color-primary); width: 200px; height: 60px;"></div>
          <div style="background-color: var(--watt-color-primary-light); width: 200px; height: 60px;"></div>
          <div style="background-color: var(--watt-color-primary-ultralight); width: 200px; height: 60px;"></div>
        </vater-stack>
        <vater-stack direction="row" gap="s" style="width: 50%; padding: var(--watt-space-s); border: 1px dashed var(--watt-color-neutral-grey-500)">
          <code style="position: absolute; align-self: flex-start; transform: translateY(calc(-100% - var(--watt-space-m)))">direction="row"</code>
          <div style="background-color: var(--watt-color-primary-dark); width: 60px; height: 200px;"></div>
          <div style="background-color: var(--watt-color-primary); width: 60px; height: 200px;"></div>
          <div style="background-color: var(--watt-color-primary-light); width: 60px; height: 200px;"></div>
          <div style="background-color: var(--watt-color-primary-ultralight); width: 60px; height: 200px;"></div>
        </vater-stack>
      </vater-flex>
    `,
  }),
};

export const Flex: StoryObj<VaterFlexComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <vater-flex direction="row" gap="m" style="height: 400px; padding-top: var(--watt-space-l)">
        <vater-flex gap="s" style="width: 50%; padding: var(--watt-space-s); border: 1px dashed var(--watt-color-neutral-grey-500)">
          <code style="position: absolute; align-self: flex-start; transform: translateY(calc(-100% - var(--watt-space-m)))">direction="column"</code>
          <div style="background-color: var(--watt-color-primary-dark); height: 60px;"></div>
          <div style="background-color: var(--watt-color-primary); height: 60px;"></div>
          <div style="background-color: var(--watt-color-primary-light); height: 60px;"></div>
          <div style="background-color: var(--watt-color-primary-ultralight); height: 60px;"></div>
        </vater-flex>
        <vater-flex direction="row" gap="s" style="width: 50%; padding: var(--watt-space-s); border: 1px dashed var(--watt-color-neutral-grey-500)">
          <code style="position: absolute; align-self: flex-start; transform: translateY(calc(-100% - var(--watt-space-m)))">direction="row"</code>
          <div style="background-color: var(--watt-color-primary-dark); width: 60px;"></div>
          <div style="background-color: var(--watt-color-primary); width: 60px;"></div>
          <div style="background-color: var(--watt-color-primary-light); width: 60px;"></div>
          <div style="background-color: var(--watt-color-primary-ultralight); width: 60px;"></div>
        </vater-flex>
      </vater-flex>
    `,
  }),
};

export const Spacer: StoryObj<VaterFlexComponent> = {
  render: (args) => ({
    props: args,
    template: `
      <vater-flex direction="row" gap="m" style="height: 400px; padding-top: var(--watt-space-l)">
        <vater-flex gap="s" style="width: 50%; padding: var(--watt-space-s); border: 1px dashed var(--watt-color-neutral-grey-500)">
          <code style="position: absolute; align-self: flex-start; transform: translateY(calc(-100% - var(--watt-space-m)))">direction="column"</code>
          <div style="background-color: var(--watt-color-primary-dark); min-height: 60px;"></div>
          <div style="background-color: var(--watt-color-primary); min-height: 60px;"></div>
          <div style="background-color: var(--watt-color-primary-light); min-height: 60px;"></div>
          <vater-spacer />
          <div style="background-color: var(--watt-color-primary-ultralight); min-height: 60px;"></div>
        </vater-flex>
        <vater-flex direction="row" gap="s" style="width: 50%; padding: var(--watt-space-s); border: 1px dashed var(--watt-color-neutral-grey-500)">
          <code style="position: absolute; align-self: flex-start; transform: translateY(calc(-100% - var(--watt-space-m)))">direction="row"</code>
          <div style="background-color: var(--watt-color-primary-dark); min-width: 60px;"></div>
          <div style="background-color: var(--watt-color-primary); min-width: 60px;"></div>
          <div style="background-color: var(--watt-color-primary-light); min-width: 60px;"></div>
          <vater-spacer />
          <div style="background-color: var(--watt-color-primary-ultralight); min-width: 60px;"></div>
        </vater-flex>
      </vater-flex>
    `,
  }),
};
