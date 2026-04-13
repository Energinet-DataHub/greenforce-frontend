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

const meta: Meta<WattSegmentedButtonsComponent & { disabled: boolean }> = {
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
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable the segmented buttons group',
    },
  },
  args: {
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<WattSegmentedButtonsComponent & { disabled: boolean }>;

const sourceCode = `
<watt-segmented-buttons [formControl]="formControl">
  <watt-segmented-button value="day">Dag</watt-segmented-button>
  <watt-segmented-button value="month">Måned</watt-segmented-button>
  <watt-segmented-button value="year">År</watt-segmented-button>
  <watt-segmented-button value="all">Alle år</watt-segmented-button>
</watt-segmented-buttons>
`.trim();

export const Overview: Story = {
  parameters: {
    docs: {
      source: { code: sourceCode },
    },
  },
  render: (args) => {
    const formControl = new FormControl('day');
    if (args.disabled) formControl.disable();
    return {
      props: { formControl },
      styles: [
        `
          :host {
            display: block;
            background: #e5e5e5;
            padding: 40px;
            margin: -16px;
          }

          .page {
            display: flex;
            flex-direction: column;
            gap: 24px;
            max-width: 560px;
          }

          .section {
            background: white;
            border-radius: 12px;
            padding: 48px 56px;
          }

          .section-title {
            font-family: 'Open Sans', sans-serif;
            font-size: 36px;
            font-weight: 300;
            color: rgba(0, 0, 0, 0.87);
            margin: 0 0 24px;
          }

          .divider {
            border: none;
            border-top: 1px solid var(--watt-color-neutral-grey-300);
            margin: 0 0 32px;
          }

          .dashed-border {
            border: 2px dashed #7c4dff;
            border-radius: 8px;
            padding: 24px 40px;
            margin-top: 8px;
          }

          .blocks-grid {
            display: grid;
            grid-template-columns: repeat(3, auto);
            gap: 24px 32px;
            justify-items: start;
          }

          .column-header {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
          }

          .hover-cell watt-segmented-button {
            background-color: var(--watt-color-neutral-grey-200);
          }

          .blocks-gap {
            grid-column: 1 / -1;
            height: 16px;
          }

          .start watt-segmented-button { border-radius: 4px 0 0 4px; }
          .middle watt-segmented-button { border-radius: 0; }
          .end watt-segmented-button { border-radius: 0 4px 4px 0; }
        `,
      ],
      template: `
        <div class="page">
          <div class="section">
            <div class="section-title">Segmented button</div>
            <hr class="divider" />
            <watt-segmented-buttons [formControl]="formControl">
              <watt-segmented-button value="day">Dag</watt-segmented-button>
              <watt-segmented-button value="month">Måned</watt-segmented-button>
              <watt-segmented-button value="year">År</watt-segmented-button>
              <watt-segmented-button value="all">Alle år</watt-segmented-button>
            </watt-segmented-buttons>
          </div>

          <div class="section">
            <div class="section-title">Building blocks</div>
            <hr class="divider" />
            <div class="dashed-border">
              <div class="blocks-grid">
                <div class="column-header">Enabled</div>
                <div class="column-header">Hover</div>
                <div class="column-header">Disabled</div>

                <div class="start">
                  <watt-segmented-button>Label</watt-segmented-button>
                </div>
                <div class="start hover-cell">
                  <watt-segmented-button>Label</watt-segmented-button>
                </div>
                <div class="start">
                  <watt-segmented-button class="watt-segmented-button--disabled">Label</watt-segmented-button>
                </div>

                <div class="middle">
                  <watt-segmented-button>Label</watt-segmented-button>
                </div>
                <div class="middle hover-cell">
                  <watt-segmented-button>Label</watt-segmented-button>
                </div>
                <div class="middle">
                  <watt-segmented-button class="watt-segmented-button--disabled">Label</watt-segmented-button>
                </div>

                <div class="end">
                  <watt-segmented-button>Label</watt-segmented-button>
                </div>
                <div class="end hover-cell">
                  <watt-segmented-button>Label</watt-segmented-button>
                </div>
                <div class="end">
                  <watt-segmented-button class="watt-segmented-button--disabled">Label</watt-segmented-button>
                </div>

                <div class="blocks-gap"></div>

                <div class="start">
                  <watt-segmented-button class="watt-segmented-button--selected">Label</watt-segmented-button>
                </div>
                <div></div>
                <div class="start">
                  <watt-segmented-button class="watt-segmented-button--disabled watt-segmented-button--selected">Label</watt-segmented-button>
                </div>

                <div class="middle">
                  <watt-segmented-button class="watt-segmented-button--selected">Label</watt-segmented-button>
                </div>
                <div></div>
                <div class="middle">
                  <watt-segmented-button class="watt-segmented-button--disabled watt-segmented-button--selected">Label</watt-segmented-button>
                </div>

                <div class="end">
                  <watt-segmented-button class="watt-segmented-button--selected">Label</watt-segmented-button>
                </div>
                <div></div>
                <div class="end">
                  <watt-segmented-button class="watt-segmented-button--disabled watt-segmented-button--selected">Label</watt-segmented-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    };
  },
};
