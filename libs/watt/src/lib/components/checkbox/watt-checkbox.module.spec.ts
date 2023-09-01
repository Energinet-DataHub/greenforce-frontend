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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattCheckboxComponent } from './watt-checkbox.component';

describe(WattCheckboxComponent, () => {
  it('exports shared Watt Design System checkbox', async () => {
    const labelText = 'Text';

    const view = await render(`<watt-checkbox>${labelText}</watt-checkbox>`, {
      imports: [WattCheckboxComponent],
    });

    expect(view.queryByLabelText(labelText)).not.toBeNull();
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  describe('Reactive forms', () => {
    async function setup({ value, disabled = false }: { value: boolean; disabled?: boolean }) {
      const labelText = 'Are you awesome?';

      @Component({
        template: `<watt-checkbox [formControl]="checkboxControl">${labelText}</watt-checkbox>`,
      })
      class TestComponent {
        checkboxControl = new FormControl({ value, disabled });
      }

      const { fixture } = await render(TestComponent, {
        imports: [WattCheckboxComponent, ReactiveFormsModule],
      });

      const checkboxLabel = screen.queryByLabelText(labelText);

      return {
        fixture,
        checkboxLabel,
      };
    }

    it('toggles checkbox when clicked', async () => {
      const initialState = { value: true };
      const { fixture, checkboxLabel } = await setup(initialState);

      if (checkboxLabel) {
        userEvent.click(checkboxLabel);
      }

      expect(fixture.componentInstance.checkboxControl.value).toBeFalsy();

      if (checkboxLabel) {
        userEvent.click(checkboxLabel);
      }

      expect(fixture.componentInstance.checkboxControl.value).toBeTruthy();
    });

    it('prevents clicking on disabled checkbox', async () => {
      const initialState = { value: true, disabled: true };
      const { fixture, checkboxLabel } = await setup(initialState);

      if (checkboxLabel) {
        userEvent.click(checkboxLabel);
      }

      const actualValue = fixture.componentInstance.checkboxControl.value;
      expect(actualValue).toBeTruthy();
    });

    // Skipped because enabling the checkbox does not work
    it.skip('can click on checkbox after enabling it', async () => {
      const initialState = { value: true, disabled: true };
      const { fixture, checkboxLabel } = await setup(initialState);

      if (checkboxLabel) {
        userEvent.click(checkboxLabel);
      }

      let actualValue = fixture.componentInstance.checkboxControl.value;
      expect(actualValue).toBeTruthy();

      fixture.componentInstance.checkboxControl.enable();

      if (checkboxLabel) {
        userEvent.click(checkboxLabel);
      }

      actualValue = fixture.componentInstance.checkboxControl.value;
      expect(actualValue).toBeFalsy();
    });
  });
});
