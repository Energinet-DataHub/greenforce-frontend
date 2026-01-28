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
import { NgTemplateOutlet } from '@angular/common';
import { RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  model,
  signal,
  inject,
  Component,
  ElementRef,
  forwardRef,
  contentChildren,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WattSegmentedButtonComponent } from './watt-segmented-button.component';

/**
 * Segmented buttons.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatButtonToggleModule,
    FormsModule,
    NgTemplateOutlet,
    RouterLinkWithHref,
    RouterLinkActive,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattSegmentedButtonsComponent),
      multi: true,
    },
  ],
  selector: 'watt-segmented-buttons',
  styles: `
    @use '@energinet/watt/utils' as watt;
    @use '@angular/material' as mat;

    :root {
      @include mat.button-toggle-overrides(
        (
          selected-state-text-color: white,
          selected-state-background-color: var(--watt-color-primary),
          height: 2.5rem,
        )
      );

      mat-button-toggle-group {
        border-color: var(--watt-color-neutral-grey-700);

        mat-button-toggle {
          border-color: var(--watt-color-neutral-grey-700) !important;

          button {
            min-width: 6.5rem;

            span {
              font-size: 0.875rem;
              font-weight: 600;
            }
          }
        }
      }
    }
  `,
  template: `
    <mat-button-toggle-group
      [(ngModel)]="selected"
      [multiple]="false"
      [hideSingleSelectionIndicator]="true"
      [disabled]="disabled()"
    >
      @for (segmentedButton of segmentedButtonElements(); track segmentedButton) {
        <mat-button-toggle
          [routerLink]="segmentedButton.link()"
          [queryParamsHandling]="'merge'"
          routerLinkActive="mat-button-toggle-checked"
          [disableRipple]="true"
          [value]="segmentedButton.value()"
        >
          <ng-container *ngTemplateOutlet="segmentedButton.templateRef()" />
        </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
})
export class WattSegmentedButtonsComponent implements ControlValueAccessor {
  private element = inject(ElementRef);
  segmentedButtonElements = contentChildren(WattSegmentedButtonComponent);
  selected = model<string>('');
  disabled = signal(false);

  writeValue(selected: string): void {
    this.selected.set(selected);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.selected.subscribe(fn);
  }

  registerOnTouched(fn: (value: boolean) => void): void {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
