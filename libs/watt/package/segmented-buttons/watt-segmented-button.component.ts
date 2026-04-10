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
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  ElementRef,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'watt-segmented-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 6.5rem;
      height: 2.5rem;
      padding: 0 0.75rem;
      border: 1px solid var(--watt-color-neutral-grey-700);
      font-size: 1rem;
      font-weight: 600;
      color: var(--watt-on-light-high-emphasis);
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;

      a, button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: inherit;
        text-decoration: none;
        background: none;
        border: none;
        font: inherit;
        cursor: inherit;
        padding: 0;
      }

      &:focus-visible {
        outline: 2px solid var(--watt-color-primary);
        outline-offset: -2px;
      }

      &:hover:not(.watt-segmented-button--selected):not(:has(a.active)):not(.watt-segmented-button--disabled),
      &:focus-within:not(.watt-segmented-button--selected):not(:has(a.active)):not(.watt-segmented-button--disabled) {
        background-color: var(--watt-color-neutral-grey-200);
      }

      &.watt-segmented-button--selected,
      &:has(a.active) {
        background-color: var(--watt-color-primary);
        color: var(--watt-color-neutral-white);
      }

      &.watt-segmented-button--disabled {
        cursor: default;
        background-color: var(--watt-color-neutral-grey-200);
        color: rgba(0, 0, 0, 0.26); /* Not part of Watt foundations — see Figma note on disabled segmented buttons */

        &.watt-segmented-button--selected {
          background-color: var(--watt-color-neutral-grey-400);
          color: var(--watt-on-light-high-emphasis); /* Not part of Watt foundations — see Figma note on disabled segmented buttons */
        }
      }

      &.watt-segmented-button--first {
        border-right-width: 0;
        border-radius: 4px 0 0 4px;
      }

      &.watt-segmented-button--middle {
        border-right-width: 0;
        border-radius: 0;
      }

      &.watt-segmented-button--last {
        border-radius: 0 4px 4px 0;
      }
    }
  `,
  host: {
    '[class.watt-segmented-button--selected]': 'selected',
    '[class.watt-segmented-button--disabled]': 'disabled',
    '[class.watt-segmented-button--first]': 'position === "first"',
    '[class.watt-segmented-button--middle]': 'position === "middle"',
    '[class.watt-segmented-button--last]': 'position === "last"',
  },
  template: `
    @if (link()) {
      <a
        [routerLink]="link()"
        queryParamsHandling="merge"
        routerLinkActive
        #rla="routerLinkActive"
        [class.active]="rla.isActive"
      >
        <ng-content />
      </a>
    } @else {
      <button type="button" [disabled]="disabled" (click)="onClick()"><ng-content /></button>
    }
  `,
})
export class WattSegmentedButtonComponent {
  value = input<string>();
  link = input<string>();

  selected = false;
  disabled = false;
  position: 'first' | 'middle' | 'last' | 'standalone' = 'standalone';

  private readonly elementRef = inject(ElementRef);

  onClick(): void {
    if (this.disabled) return;
    this.elementRef.nativeElement.dispatchEvent(
      new CustomEvent('segmentSelect', { bubbles: true, detail: this.value() })
    );
  }
}
