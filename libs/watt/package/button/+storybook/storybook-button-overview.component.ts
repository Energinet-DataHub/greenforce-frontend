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
import {
  inject,
  Renderer2,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { VATER } from '../../vater';

import { WattButtonComponent } from '../watt-button.component';

@Component({
  selector: 'storybook-button-overview',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      storybook-button-overview .button-state-grid watt-button {
        justify-self: start;
      }

      storybook-button-overview watt-button.storybook-forced-focus-visible::after {
        content: '';
        position: absolute;
        inset: calc(var(--watt-button-focus-offset) * -1);
        border: var(--watt-button-focus-width) solid var(--watt-button-focus-color);
        border-radius: var(--watt-button-focus-radius);
        pointer-events: none;
      }

      storybook-button-overview
        watt-button.watt-button--primary
        .mat-mdc-button.mat-primary.storybook-forced-hover {
        background: var(--watt-color-primary-dark);
      }

      storybook-button-overview
        watt-button.watt-button--secondary
        .mat-mdc-button.mat-secondary.storybook-forced-hover {
        background: var(--watt-color-primary-light);
      }

      storybook-button-overview
        watt-button.watt-button--text
        .mat-mdc-button.mat-text.storybook-forced-hover {
        color: var(--watt-button-text-hover-color);
      }

      storybook-button-overview
        watt-button.watt-button--icon
        .mat-mdc-button.mat-icon.storybook-forced-hover {
        color: var(--watt-color-primary-dark);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './storybook-button-overview.component.html',
  imports: [WattButtonComponent, VATER],
})
export class StorybookButtonOverviewComponent implements AfterViewInit {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    this.forceState('hover', 'storybook-forced-hover');
    this.forceState('focus', 'storybook-forced-focus-visible', false);
  }

  private forceState(state: 'focus' | 'hover', className: string, applyToInnerButton = true): void {
    const buttons = this.host.nativeElement.querySelectorAll<HTMLElement>(
      `watt-button[data-storybook-state="${state}"]`
    );

    buttons.forEach((button) => {
      this.renderer.addClass(button, className);

      if (!applyToInnerButton) {
        return;
      }

      const innerButton = button.querySelector('.mat-mdc-button');

      if (innerButton) {
        this.renderer.addClass(innerButton, className);
      }
    });
  }
}
