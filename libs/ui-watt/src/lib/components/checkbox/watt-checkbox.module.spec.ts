import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import user from '@testing-library/user-event';

import { WattCheckboxModule } from './watt-checkbox.module';

describe(WattCheckboxModule.name, () => {
  it('exports shared Watt Design System checkbox', async () => {
    const labelText = 'Text';

    const view = await render(`<watt-checkbox>${labelText}</watt-checkbox>`, {
      imports: [WattCheckboxModule],
    });

    expect(view.queryByLabelText(labelText)).not.toBeNull();
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  describe('Reactive forms', () => {
    async function setup(initialState: { value: boolean; disabled?: boolean }) {
      const labelText = 'Are you awesome?';

      @Component({
        template: `<watt-checkbox [formControl]="checkboxControl"
          >${labelText}</watt-checkbox
        >`,
      })
      class TestComponent {
        checkboxControl = new FormControl(initialState);
      }

      const { fixture } = await render(TestComponent, {
        imports: [WattCheckboxModule, ReactiveFormsModule],
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
        user.click(checkboxLabel);
      }

      expect(fixture.componentInstance.checkboxControl.value).toBeFalsy();

      if (checkboxLabel) {
        user.click(checkboxLabel);
      }

      expect(fixture.componentInstance.checkboxControl.value).toBeTruthy();
    });

    it('prevents clicking on disabled checkbox', async () => {
      const initialState = { value: true, disabled: true };
      const { fixture, checkboxLabel } = await setup(initialState);

      if (checkboxLabel) {
        user.click(checkboxLabel);
      }

      const actualValue = fixture.componentInstance.checkboxControl.value;
      expect(actualValue).toBeTruthy();
    });

    it('can click on checkbox after enabling it', async () => {
      const initialState = { value: true, disabled: true };
      const { fixture, checkboxLabel } = await setup(initialState);

      if (checkboxLabel) {
        user.click(checkboxLabel);
      }

      let actualValue = fixture.componentInstance.checkboxControl.value;
      expect(actualValue).toBeTruthy();

      fixture.componentInstance.checkboxControl.enable();

      if (checkboxLabel) {
        user.click(checkboxLabel);
      }

      actualValue = fixture.componentInstance.checkboxControl.value;
      expect(actualValue).toBeFalsy();
    });
  });
});
