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
import { moduleMetadata, StoryObj } from '@storybook/angular';
import { VaterFlexComponent } from '../vater';
import { StorybookPeriodicElements } from './+storybook/storybook-periodic-elements';
import { StorybookPeriodicElementsByType } from './+storybook/storybook-periodic-elements-by-type';
import {
  periodicElementsByType,
  periodicElements,
} from './+storybook/storybook-periodic-elements-data';

export default {
  title: 'Components/Table',
  decorators: [
    moduleMetadata({
      imports: [StorybookPeriodicElements, StorybookPeriodicElementsByType, VaterFlexComponent],
    }),
  ],
};

export const Expandable: StoryObj<StorybookPeriodicElementsByType> = {
  args: { data: periodicElementsByType },
  render: (args) => ({
    props: args,
    template: `
      <vater-flex inset="m">
        <storybook-periodic-elements-by-type [data]="data" />
      </vater-flex>`,
  }),
};

export const Selectable: StoryObj<StorybookPeriodicElements> = {
  args: {
    data: periodicElements,
    selectable: true,
    selection: [periodicElements[0], periodicElements[1]],
  },
  render: (args) => ({
    props: args,
    template: `
      <vater-flex inset="m">
        <storybook-periodic-elements
          [data]="data"
          [selectable]="selectable"
          [selection]="selection"
        />
      </vater-flex>`,
  }),
};
