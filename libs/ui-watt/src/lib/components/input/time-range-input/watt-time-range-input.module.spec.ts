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
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattTimeRange } from './watt-time-range-input.component';
import { WattTimeRangeInputModule } from './watt-time-range-input.module';
import { WattFormFieldModule } from '../../form-field/form-field.module';

const backspace = '{backspace}';

describe(WattTimeRangeInputModule.name, () => {
  async function setup({
    template,
    initialState = null,
  }: {
    template: string;
    initialState?: WattTimeRange | null;
  }) {
    @Component({
      template,
    })
    class TestComponent {
      timeRangeControl = new FormControl(initialState);
      timeRangeModel = initialState;
    }

    const { fixture } = await render(TestComponent, {
      imports: [
        WattTimeRangeInputModule,
        ReactiveFormsModule,
        FormsModule,
        WattFormFieldModule,
        BrowserAnimationsModule,
      ],
    });

    const [startTimeInput, endTimeInput] = screen.queryAllByRole(
      'textbox'
    ) as HTMLInputElement[];

    return {
      fixture,
      startTimeInput,
      endTimeInput,
    };
  }

  describe('with reactive forms', () => {
    const template = `
<watt-form-field>
  <watt-time-range-input
    [formControl]="timeRangeControl"
  ></watt-time-range-input>
</watt-form-field>`;

    commonTests(template);

    it('can input a start time', async () => {
      const { fixture, startTimeInput } = await setup({
        template,
      });

      userEvent.clear(startTimeInput);
      userEvent.type(startTimeInput, '0123');

      const actualTimeRange = fixture.componentInstance.timeRangeControl.value;
      const expectedTimeRange: WattTimeRange = { start: '01:23', end: '' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('can input an end time', async () => {
      const { fixture, endTimeInput } = await setup({
        template,
      });

      userEvent.clear(endTimeInput);
      userEvent.type(endTimeInput, '1234');

      const actualTimeRange = fixture.componentInstance.timeRangeControl.value;
      const expectedTimeRange: WattTimeRange = { start: '', end: '12:34' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('can input both start and end time', async () => {
      const { fixture, startTimeInput, endTimeInput } = await setup({
        template,
      });

      userEvent.clear(startTimeInput);
      userEvent.type(startTimeInput, '0123');

      userEvent.clear(endTimeInput);
      userEvent.type(endTimeInput, '1234');

      const actualTimeRange = fixture.componentInstance.timeRangeControl.value;
      const expectedTimeRange: WattTimeRange = { start: '01:23', end: '12:34' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('clears the value when an input with incomplete time loses focus', async () => {
      const timeRange: WattTimeRange = { start: '01:23', end: '12:34' };

      const { fixture, startTimeInput, endTimeInput } = await setup({
        template,
        initialState: timeRange,
      });

      userEvent.type(endTimeInput, backspace);
      endTimeInput.blur();

      userEvent.type(startTimeInput, backspace);
      startTimeInput.blur();

      const actualTimeRange = fixture.componentInstance.timeRangeControl.value;
      const expectedTimeRange: WattTimeRange = { start: '', end: '' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });
  });

  describe('with template-driven forms', () => {
    const template = `
<watt-form-field>
  <watt-time-range-input
    [(ngModel)]="timeRangeModel"
  ></watt-time-range-input>
</watt-form-field>`;

    commonTests(template);

    it('can input a start time', async () => {
      const { fixture, startTimeInput } = await setup({
        template,
      });

      userEvent.clear(startTimeInput);
      userEvent.type(startTimeInput, '0123');

      const actualTimeRange = fixture.componentInstance.timeRangeModel;
      const expectedTimeRange: WattTimeRange = { start: '01:23', end: '' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('can input an end time', async () => {
      const { fixture, endTimeInput } = await setup({
        template,
      });

      userEvent.clear(endTimeInput);
      userEvent.type(endTimeInput, '1234');

      const actualTimeRange = fixture.componentInstance.timeRangeModel;
      const expectedTimeRange: WattTimeRange = { start: '', end: '12:34' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('can input both start and end time', async () => {
      const { fixture, startTimeInput, endTimeInput } = await setup({
        template,
      });

      userEvent.clear(startTimeInput);
      userEvent.type(startTimeInput, '0123');

      userEvent.clear(endTimeInput);
      userEvent.type(endTimeInput, '1234');

      const actualTimeRange = fixture.componentInstance.timeRangeModel;
      const expectedTimeRange: WattTimeRange = { start: '01:23', end: '12:34' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('clears the value when an input with incomplete time loses focus', async () => {
      const timeRange: WattTimeRange = { start: '01:23', end: '12:34' };

      const { fixture, startTimeInput, endTimeInput } = await setup({
        template,
        initialState: timeRange,
      });

      userEvent.type(endTimeInput, backspace);
      endTimeInput.blur();

      userEvent.type(startTimeInput, backspace);
      startTimeInput.blur();

      const actualTimeRange = fixture.componentInstance.timeRangeModel;
      const expectedTimeRange: WattTimeRange = { start: '', end: '' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });
  });

  function commonTests(template: string) {
    it('contains two input fields', async () => {
      await setup({ template });

      const inputs = screen.queryAllByRole('textbox');

      expect(inputs.length).toBe(2);
    });

    it('can set an initial state', async () => {
      const timeRange: WattTimeRange = { start: '01:23', end: '12:34' };

      const { startTimeInput, endTimeInput } = await setup({
        template,
        initialState: timeRange,
      });

      expect(startTimeInput.value).toBe('01:23');
      expect(endTimeInput.value).toBe('12:34');
    });
  }
});
