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
import { Meta, applicationConfig, moduleMetadata, StoryObj } from '@storybook/angular';
import { provideRouter } from '@angular/router';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattSegmentedButtonsComponent } from '../watt-segmented-buttons.component';
import { WattSegmentedButtonComponent } from '../watt-segmented-button.component';

const meta: Meta<WattSegmentedButtonsComponent> = {
  title: 'Components/Segmented buttons',
  component: WattSegmentedButtonsComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
    moduleMetadata({
      imports: [ReactiveFormsModule, WattSegmentedButtonsComponent, WattSegmentedButtonComponent],
    }),
  ],
};
export default meta;

type Story = StoryObj<WattSegmentedButtonsComponent>;

export const Overview: Story = {
  render: () => ({
    props: { formControl: new FormControl('day') },
    template: `
      <watt-segmented-buttons [formControl]="formControl">
        <watt-segmented-button value="day">Dag</watt-segmented-button>
        <watt-segmented-button value="month">Måned</watt-segmented-button>
        <watt-segmented-button value="year">År</watt-segmented-button>
        <watt-segmented-button value="all">Alle år</watt-segmented-button>
      </watt-segmented-buttons>
    `,
  }),
};

export const Standalone: Story = {
  render: () => ({
    props: { formControl: new FormControl('only') },
    template: `
      <watt-segmented-buttons [formControl]="formControl">
        <watt-segmented-button value="only">Only option</watt-segmented-button>
      </watt-segmented-buttons>
    `,
  }),
};

export const SelectedPositions: Story = {
  name: 'Selected positions',
  render: () => ({
    props: {
      firstSelected: new FormControl('day'),
      middleSelected: new FormControl('month'),
      lastSelected: new FormControl('year'),
      noneSelected: new FormControl(null),
    },
    styles: [`.stack { display: flex; flex-direction: column; gap: 16px; }`],
    template: `
      <div class="stack">
        <watt-segmented-buttons [formControl]="noneSelected">
          <watt-segmented-button value="day">Dag</watt-segmented-button>
          <watt-segmented-button value="month">Måned</watt-segmented-button>
          <watt-segmented-button value="year">År</watt-segmented-button>
        </watt-segmented-buttons>

        <watt-segmented-buttons [formControl]="firstSelected">
          <watt-segmented-button value="day">Dag</watt-segmented-button>
          <watt-segmented-button value="month">Måned</watt-segmented-button>
          <watt-segmented-button value="year">År</watt-segmented-button>
        </watt-segmented-buttons>

        <watt-segmented-buttons [formControl]="middleSelected">
          <watt-segmented-button value="day">Dag</watt-segmented-button>
          <watt-segmented-button value="month">Måned</watt-segmented-button>
          <watt-segmented-button value="year">År</watt-segmented-button>
        </watt-segmented-buttons>

        <watt-segmented-buttons [formControl]="lastSelected">
          <watt-segmented-button value="day">Dag</watt-segmented-button>
          <watt-segmented-button value="month">Måned</watt-segmented-button>
          <watt-segmented-button value="year">År</watt-segmented-button>
        </watt-segmented-buttons>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    props: {
      disabledNoSelection: new FormControl({ value: null, disabled: true }),
      disabledWithSelection: new FormControl({ value: 'month', disabled: true }),
    },
    styles: [`.stack { display: flex; flex-direction: column; gap: 16px; }`],
    template: `
      <div class="stack">
        <watt-segmented-buttons [formControl]="disabledNoSelection">
          <watt-segmented-button value="day">Dag</watt-segmented-button>
          <watt-segmented-button value="month">Måned</watt-segmented-button>
          <watt-segmented-button value="year">År</watt-segmented-button>
        </watt-segmented-buttons>

        <watt-segmented-buttons [formControl]="disabledWithSelection">
          <watt-segmented-button value="day">Dag</watt-segmented-button>
          <watt-segmented-button value="month">Måned</watt-segmented-button>
          <watt-segmented-button value="year">År</watt-segmented-button>
        </watt-segmented-buttons>
      </div>
    `,
  }),
};

export const WithRouterLinks: Story = {
  name: 'With router links',
  render: () => ({
    template: `
      <watt-segmented-buttons>
        <watt-segmented-button link="/day">Dag</watt-segmented-button>
        <watt-segmented-button link="/month">Måned</watt-segmented-button>
        <watt-segmented-button link="/year">År</watt-segmented-button>
      </watt-segmented-buttons>
    `,
  }),
};
