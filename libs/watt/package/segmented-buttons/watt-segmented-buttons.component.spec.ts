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
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattSegmentedButtonComponent } from './watt-segmented-button.component';
import { WattSegmentedButtonsComponent } from './watt-segmented-buttons.component';

describe(WattSegmentedButtonsComponent, () => {
  describe('content projection', () => {
    it('projects content inside the button variant', async () => {
      await render(
        `
          <watt-segmented-buttons>
            <watt-segmented-button value="day">Day label</watt-segmented-button>
          </watt-segmented-buttons>
        `,
        { imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent] }
      );

      expect(screen.getByRole('radio', { name: 'Day label' })).toBeInTheDocument();
    });

    it('projects content inside the link variant', async () => {
      await render(
        `
          <watt-segmented-buttons>
            <watt-segmented-button link="/day">Day link</watt-segmented-button>
          </watt-segmented-buttons>
        `,
        {
          imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent],
          providers: [provideRouter([])],
        }
      );

      const link = screen.getByRole('radio', { name: 'Day link' });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/day');
    });

    it('projects content in both variants when rendered side by side', async () => {
      await render(
        `
          <watt-segmented-buttons>
            <watt-segmented-button value="one">One</watt-segmented-button>
            <watt-segmented-button link="/two">Two</watt-segmented-button>
            <watt-segmented-button value="three">Three</watt-segmented-button>
          </watt-segmented-buttons>
        `,
        {
          imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent],
          providers: [provideRouter([])],
        }
      );

      expect(screen.getByRole('radio', { name: 'One' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Two' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Three' })).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    async function setup(initialValue: string | null = 'day') {
      @Component({
        imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent, ReactiveFormsModule],
        template: `
          <watt-segmented-buttons [formControl]="control">
            <watt-segmented-button value="day">Day</watt-segmented-button>
            <watt-segmented-button value="month">Month</watt-segmented-button>
            <watt-segmented-button value="year">Year</watt-segmented-button>
          </watt-segmented-buttons>
        `,
      })
      class TestHostComponent {
        control = new FormControl(initialValue);
      }

      const { fixture } = await render(TestHostComponent);
      return { host: fixture.componentInstance };
    }

    it('marks the initially selected button as checked', async () => {
      await setup('month');

      expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: 'Year' })).toHaveAttribute('aria-checked', 'false');
    });

    it('updates the form control when clicking a button', async () => {
      const { host } = await setup('day');

      await userEvent.click(screen.getByRole('radio', { name: 'Year' }));

      expect(host.control.value).toBe('year');
      expect(screen.getByRole('radio', { name: 'Year' })).toHaveAttribute('aria-checked', 'true');
    });

    it('does not emit when a button has no value', async () => {
      @Component({
        imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent, ReactiveFormsModule],
        template: `
          <watt-segmented-buttons [formControl]="control">
            <watt-segmented-button value="keep">Keep</watt-segmented-button>
            <watt-segmented-button>No value</watt-segmented-button>
          </watt-segmented-buttons>
        `,
      })
      class TestHostComponent {
        control = new FormControl('keep');
      }

      const { fixture } = await render(TestHostComponent);

      await userEvent.click(screen.getByRole('radio', { name: 'No value' }));

      expect(fixture.componentInstance.control.value).toBe('keep');
    });
  });

  describe('disabled state', () => {
    it('marks all buttons with aria-disabled when the group is disabled', async () => {
      @Component({
        imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent, ReactiveFormsModule],
        template: `
          <watt-segmented-buttons [formControl]="control">
            <watt-segmented-button value="day">Day</watt-segmented-button>
            <watt-segmented-button value="month">Month</watt-segmented-button>
          </watt-segmented-buttons>
        `,
      })
      class TestHostComponent {
        control = new FormControl({ value: 'day', disabled: true });
      }

      await render(TestHostComponent);

      expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not change selection when clicking a disabled group', async () => {
      @Component({
        imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent, ReactiveFormsModule],
        template: `
          <watt-segmented-buttons [formControl]="control">
            <watt-segmented-button value="day">Day</watt-segmented-button>
            <watt-segmented-button value="month">Month</watt-segmented-button>
          </watt-segmented-buttons>
        `,
      })
      class TestHostComponent {
        control = new FormControl({ value: 'day', disabled: true });
      }

      const { fixture } = await render(TestHostComponent);

      await userEvent.click(screen.getByRole('radio', { name: 'Month' }));

      expect(fixture.componentInstance.control.value).toBe('day');
    });

    it('removes disabled link from tab order and prevents navigation', async () => {
      @Component({
        imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent, ReactiveFormsModule],
        template: `
          <watt-segmented-buttons [formControl]="control">
            <watt-segmented-button link="/day">Day</watt-segmented-button>
          </watt-segmented-buttons>
        `,
      })
      class TestHostComponent {
        control = new FormControl({ value: null, disabled: true });
      }

      await render(TestHostComponent, { providers: [provideRouter([])] });

      const link = screen.getByRole('radio', { name: 'Day' });
      expect(link).toHaveAttribute('tabindex', '-1');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).not.toHaveAttribute('href');
    });
  });

  describe('accessibility', () => {
    it('exposes the group as a radiogroup', async () => {
      await render(
        `
          <watt-segmented-buttons>
            <watt-segmented-button value="day">Day</watt-segmented-button>
            <watt-segmented-button value="month">Month</watt-segmented-button>
          </watt-segmented-buttons>
        `,
        { imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent] }
      );

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('uses roving tabindex so only the selected button is in the tab order', async () => {
      @Component({
        imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent, ReactiveFormsModule],
        template: `
          <watt-segmented-buttons [formControl]="control">
            <watt-segmented-button value="day">Day</watt-segmented-button>
            <watt-segmented-button value="month">Month</watt-segmented-button>
            <watt-segmented-button value="year">Year</watt-segmented-button>
          </watt-segmented-buttons>
        `,
      })
      class TestHostComponent {
        control = new FormControl('month');
      }

      await render(TestHostComponent);

      expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('tabindex', '-1');
      expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('radio', { name: 'Year' })).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('keyboard navigation', () => {
    async function setup(initialValue: string | null = 'day') {
      @Component({
        imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent, ReactiveFormsModule],
        template: `
          <watt-segmented-buttons [formControl]="control">
            <watt-segmented-button value="day">Day</watt-segmented-button>
            <watt-segmented-button value="month">Month</watt-segmented-button>
            <watt-segmented-button value="year">Year</watt-segmented-button>
          </watt-segmented-buttons>
        `,
      })
      class TestHostComponent {
        control = new FormControl(initialValue);
      }

      const { fixture } = await render(TestHostComponent);
      return { host: fixture.componentInstance };
    }

    it('moves selection right with ArrowRight', async () => {
      const { host } = await setup('day');
      screen.getByRole('radio', { name: 'Day' }).focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(host.control.value).toBe('month');
    });

    it('moves selection left with ArrowLeft', async () => {
      const { host } = await setup('month');
      screen.getByRole('radio', { name: 'Month' }).focus();

      await userEvent.keyboard('{ArrowLeft}');

      expect(host.control.value).toBe('day');
    });

    it('wraps from last to first on ArrowRight', async () => {
      const { host } = await setup('year');
      screen.getByRole('radio', { name: 'Year' }).focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(host.control.value).toBe('day');
    });

    it('wraps from first to last on ArrowLeft', async () => {
      const { host } = await setup('day');
      screen.getByRole('radio', { name: 'Day' }).focus();

      await userEvent.keyboard('{ArrowLeft}');

      expect(host.control.value).toBe('year');
    });

    it('jumps to first with Home', async () => {
      const { host } = await setup('year');
      screen.getByRole('radio', { name: 'Year' }).focus();

      await userEvent.keyboard('{Home}');

      expect(host.control.value).toBe('day');
    });

    it('jumps to last with End', async () => {
      const { host } = await setup('day');
      screen.getByRole('radio', { name: 'Day' }).focus();

      await userEvent.keyboard('{End}');

      expect(host.control.value).toBe('year');
    });
  });

  describe('single button', () => {
    it('renders a single button as a standalone (full border radius)', async () => {
      const { container } = await render(
        `
          <watt-segmented-buttons>
            <watt-segmented-button value="only">Only</watt-segmented-button>
          </watt-segmented-buttons>
        `,
        { imports: [WattSegmentedButtonsComponent, WattSegmentedButtonComponent] }
      );

      const button = container.querySelector('watt-segmented-button');
      expect(button).not.toHaveClass('watt-segmented-button--first');
      expect(button).not.toHaveClass('watt-segmented-button--middle');
      expect(button).not.toHaveClass('watt-segmented-button--last');
    });
  });
});
