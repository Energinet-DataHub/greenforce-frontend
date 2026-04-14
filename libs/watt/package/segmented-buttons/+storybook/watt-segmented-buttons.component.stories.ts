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
import { Component, effect, input, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { Meta, applicationConfig, moduleMetadata, StoryObj } from '@storybook/angular';

import { WattSegmentedButtonsComponent } from '../watt-segmented-buttons.component';
import { WattSegmentedButtonComponent } from '../watt-segmented-button.component';

const BLOCK_ROWS = [0, 1, 2] as const;

@Component({
  selector: 'watt-segmented-buttons-showcase',
  imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  styles: `
    .watt-segmented-buttons-showcase {
      background: #e5e5e5;
      padding: 40px;
      margin: -16px;

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

      .blocks-gap {
        grid-column: 1 / -1;
        height: 16px;
      }

      /*
       * Hover is an interaction state and cannot be expressed via FormControl
       * or component inputs. The block below mirrors the component's own
       * :hover background so the documentation matches Figma exactly.
       */
      .hover-cell watt-segmented-button button {
        background-color: var(--watt-color-neutral-grey-200);
      }
    }
  `,
  template: `
    <div class="watt-segmented-buttons-showcase">
      <div class="page">
        <div class="section">
          <div class="section-title">Segmented button</div>
          <hr class="divider" />
          <watt-segmented-buttons [formControl]="overviewControl">
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

              @for (i of rows; track i) {
                <watt-segmented-buttons>
                  <watt-segmented-button>Label</watt-segmented-button>
                </watt-segmented-buttons>

                <div class="hover-cell">
                  <watt-segmented-buttons>
                    <watt-segmented-button>Label</watt-segmented-button>
                  </watt-segmented-buttons>
                </div>

                <watt-segmented-buttons [formControl]="disabledBlocks[i]">
                  <watt-segmented-button value="x">Label</watt-segmented-button>
                </watt-segmented-buttons>
              }

              <div class="blocks-gap"></div>

              @for (i of rows; track i) {
                <watt-segmented-buttons [formControl]="selectedBlocks[i]">
                  <watt-segmented-button value="x">Label</watt-segmented-button>
                </watt-segmented-buttons>

                <div></div>

                <watt-segmented-buttons [formControl]="disabledSelectedBlocks[i]">
                  <watt-segmented-button value="x">Label</watt-segmented-button>
                </watt-segmented-buttons>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class WattSegmentedButtonsShowcase {
  disabled = input(false);

  overviewControl = new FormControl('day');
  disabledBlocks = BLOCK_ROWS.map(() => new FormControl({ value: null, disabled: true }));
  selectedBlocks = BLOCK_ROWS.map(() => new FormControl('x'));
  disabledSelectedBlocks = BLOCK_ROWS.map(
    () => new FormControl({ value: 'x', disabled: true })
  );

  rows = BLOCK_ROWS;

  constructor() {
    effect(() => {
      if (this.disabled()) this.overviewControl.disable();
      else this.overviewControl.enable();
    });
  }
}

const meta: Meta<WattSegmentedButtonsShowcase> = {
  title: 'Components/Segmented buttons',
  component: WattSegmentedButtonsShowcase,
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({ imports: [WattSegmentedButtonsShowcase] }),
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

type Story = StoryObj<WattSegmentedButtonsShowcase>;

export const Overview: Story = {
  render: (args) => ({
    props: args,
    template: `<watt-segmented-buttons-showcase [disabled]="disabled" />`,
  }),
};
