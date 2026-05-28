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
import { FormControl } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { render, screen } from '@testing-library/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { WattDateChipComponent } from './watt-date-chip.component';

describe(WattDateChipComponent.name, () => {
  const setup = async (
    componentInputs: Partial<{
      formControl: FormControl<Date | null>;
      disabled: boolean;
      label: string;
      placeholder: string;
      value: Date;
      min: Date | null;
      max: Date | null;
    }> = {}
  ) => {
    const defaultFormControl = new FormControl<Date | null>(null);
    const selectionChangeSpy = vi.fn();

    const { fixture } = await render(WattDateChipComponent, {
      imports: [MatNativeDateModule],
      providers: [provideAnimations()],
      inputs: {
        formControl: defaultFormControl,
        ...componentInputs,
      },
      on: {
        selectionChange: selectionChangeSpy,
      },
    });

    return {
      fixture,
      selectionChangeSpy,
      formControl: componentInputs.formControl ?? defaultFormControl,
      component: fixture.componentInstance,
    };
  };

  it('renders the placeholder', async () => {
    await setup({ placeholder: 'Active period' });
    expect(screen.getByText('Active period')).toBeInTheDocument();
  });

  it('shows the selected date formatted via wattDate', async () => {
    // UTC-midnight Date for Jan 15 2025 displays as '15-01-2025' in Copenhagen TZ.
    const selected = new Date(Date.UTC(2025, 0, 15));
    await setup({ value: selected, formControl: new FormControl(selected) });

    expect(screen.getByText('15-01-2025')).toBeInTheDocument();
  });

  describe('timezone-safe date handling (issue #3911)', () => {
    it('onDateChange normalizes a local-time Date to UTC midnight', async () => {
      const { component, selectionChangeSpy } = await setup();

      // Simulate Material's emission: a local-time Date for Jan 15.
      component['onDateChange'](new Date(2025, 0, 15, 8, 30));

      const stored = component.value();
      expect(stored).not.toBeNull();
      expect(stored?.toISOString()).toBe('2025-01-15T00:00:00.000Z');
      expect(selectionChangeSpy).toHaveBeenCalledWith(stored);
    });

    it('onDateChange with null clears the value', async () => {
      const initial = new Date(Date.UTC(2025, 0, 15));
      const { component, selectionChangeSpy } = await setup({
        value: initial,
        formControl: new FormControl(initial),
      });

      component['onDateChange'](null);

      expect(component.value()).toBeNull();
      expect(selectionChangeSpy).toHaveBeenCalledWith(null);
    });

    it('materialValue projects the stored UTC date back to a local calendar day for Material', async () => {
      const selected = new Date(Date.UTC(2025, 5, 7));
      const { component } = await setup({
        value: selected,
        formControl: new FormControl(selected),
      });

      // Material's calendar must see the same calendar day (7 June) the user picked,
      // regardless of the runtime timezone.
      const projected = component['materialValue']();
      expect(projected?.getFullYear()).toBe(2025);
      expect(projected?.getMonth()).toBe(5);
      expect(projected?.getDate()).toBe(7);
    });

    it('display formatting stays on the picked calendar day', async () => {
      // A UTC-midnight model value should always render as that same day in Copenhagen,
      // not the previous day as the old (raw local Date) implementation did.
      const selected = new Date(Date.UTC(2025, 0, 15));
      await setup({ value: selected, formControl: new FormControl(selected) });

      expect(screen.getByText('15-01-2025')).toBeInTheDocument();
    });
  });
});
