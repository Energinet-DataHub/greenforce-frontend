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
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { danishLocalProviders } from '@energinet-datahub/gf/globalization/configuration-danish-locale';
import { WattTimepickerComponent } from './';
import { WattDateRange } from '@energinet-datahub/watt/utils/date';
import { danishDatetimeProviders } from '@energinet-datahub/watt/core/datetime';

const backspace = '{backspace}';

describe(WattTimepickerComponent, () => {
  async function setup({
    template,
    initialState = null,
    disabled = false,
  }: {
    template: string;
    initialState?: WattDateRange | null;
    disabled?: boolean;
  }) {
    @Component({
      template,
    })
    class TestComponent {
      timeRangeControl = new FormControl({ value: initialState, disabled });
      timeRangeModel = initialState;
    }

    const { fixture } = await render(TestComponent, {
      providers: [danishLocalProviders, danishDatetimeProviders],
      imports: [WattTimepickerComponent, ReactiveFormsModule, FormsModule, BrowserAnimationsModule],
    });

    const [startTimeInput, endTimeInput, _3rdInput] = screen.queryAllByRole(
      'textbox'
    ) as HTMLInputElement[];

    return {
      fixture,
      startTimeInput,
      endTimeInput,
      timepickerInput: _3rdInput,
    };
  }

  describe('with reactive forms', () => {
    const template = `
      <watt-timepicker
        [formControl]="timeRangeControl"
        [range]="true"
        sliderLabel="Adjust time range"
      />`;

    commonTests(template);

    it('can input start and end time', async () => {
      const { fixture, timepickerInput } = await setup({
        template,
      });

      const startTime = '0123';
      const endTime = '1234';

      userEvent.clear(timepickerInput);
      userEvent.type(timepickerInput, `${startTime}${endTime}`);

      const actualTimeRange = fixture.componentInstance.timeRangeControl.value;
      const expectedTimeRange: WattDateRange = { start: '01:23', end: '12:34' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('clears the value when incomplete time is provided', async () => {
      const timeRange: WattDateRange = { start: '01:23', end: '12:34' };

      const { fixture, timepickerInput } = await setup({
        template,
        initialState: timeRange,
      });

      // Delete one character from the end
      userEvent.type(timepickerInput, backspace);

      let actualTimeRange = fixture.componentInstance.timeRangeControl.value;
      let expectedTimeRange: WattDateRange = { start: '01:23', end: '' };

      expect(actualTimeRange).toEqual(expectedTimeRange);

      // Current state: `01:23 - 12:3`
      // Delete eight (`3 - 12:3`) characters from the end
      userEvent.type(timepickerInput, Array(8).fill(backspace).join(''));

      actualTimeRange = fixture.componentInstance.timeRangeControl.value;
      expectedTimeRange = { start: '', end: '' };

      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('starts with slider hidden', async () => {
      await setup({ template });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows slider on button click', async () => {
      await setup({ template });

      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;

      userEvent.click(sliderToggle);

      expect(screen.queryByRole('dialog')).not.toBeEmptyDOMElement();
    });

    it('hides slider on second button click', async () => {
      await setup({ template });

      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;

      userEvent.click(sliderToggle);
      userEvent.click(sliderToggle);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('disables slider button', async () => {
      await setup({ template, disabled: true });

      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;

      userEvent.click(sliderToggle, undefined, {
        skipPointerEventsCheck: true,
      });

      expect(sliderToggle).toBeDisabled();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('hides slider on blur', async () => {
      await setup({ template });
      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;

      userEvent.click(sliderToggle);
      sliderToggle.blur();

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows slider with default values if input is empty', async () => {
      await setup({ template });

      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;
      userEvent.click(sliderToggle);

      const [leftHandle, rightHandle] = screen.queryAllByRole('slider');

      const left = (leftHandle as HTMLInputElement).valueAsNumber;
      const right = (rightHandle as HTMLInputElement).valueAsNumber;

      expect(left).toEqual(0); // 00:00
      expect(right).toEqual(1439); // 23:59
    });

    it('shows slider with initial values from state', async () => {
      await setup({ template, initialState: { start: '00:10', end: '23:20' } });

      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;
      userEvent.click(sliderToggle);

      const [leftHandle, rightHandle] = screen.queryAllByRole('slider');

      const left = (leftHandle as HTMLInputElement).valueAsNumber;
      const right = (rightHandle as HTMLInputElement).valueAsNumber;

      expect(left).toEqual(10); // 00:10
      expect(right).toEqual(1400); // 23:20
    });

    it('adjusts input values when slider changes', async () => {
      const { fixture } = await setup({
        template,
        initialState: { start: '00:00', end: '23:59' },
      });

      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;
      userEvent.click(sliderToggle);

      const [leftHandle, rightHandle] = screen.queryAllByRole('slider');

      fireEvent.input(leftHandle, { target: { value: 15 } }); // 00:15
      fireEvent.input(rightHandle, { target: { value: 1425 } }); // 23:45

      const actualTimeRange = fixture.componentInstance.timeRangeControl.value;
      const expectedTimeRange: WattDateRange = { start: '00:15', end: '23:45' };
      expect(actualTimeRange).toEqual(expectedTimeRange);
    });

    it('adjusts slider values when input changes', async () => {
      const { timepickerInput } = await setup({ template });

      const startTime = '0123';
      const endTime = '2345';

      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;
      userEvent.click(sliderToggle);

      userEvent.clear(timepickerInput);
      userEvent.type(timepickerInput, `${startTime}${endTime}`);

      const [leftHandle, rightHandle] = screen.queryAllByRole('slider');

      const left = (leftHandle as HTMLInputElement).valueAsNumber;
      const right = (rightHandle as HTMLInputElement).valueAsNumber;

      expect(left).toEqual(83); // 01:23
      expect(right).toEqual(1425); // 23:45
    });

    it('displays slider label with value from input', async () => {
      await setup({ template });

      const sliderToggle = screen.queryByRole('button') as HTMLButtonElement;

      userEvent.click(sliderToggle);

      expect(screen.queryByText('Adjust time range')).toBeInTheDocument();
    });
  });

  function commonTests(template: string) {
    it('contains three input fields', async () => {
      await setup({ template });

      // 1 for start time input
      // 1 for end time input
      // 1 for mask input
      const inputs = screen.queryAllByRole('textbox');

      expect(inputs.length).toBe(3);
    });

    it('can set an initial state', async () => {
      const timeRange: WattDateRange = { start: '01:23', end: '12:34' };

      const { startTimeInput, endTimeInput } = await setup({
        template,
        initialState: timeRange,
      });

      expect(startTimeInput.value).toBe('01:23');
      expect(endTimeInput.value).toBe('12:34');
    });
  }
});
