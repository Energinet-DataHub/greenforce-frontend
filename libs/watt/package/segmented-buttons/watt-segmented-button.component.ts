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
import { Component, ChangeDetectionStrategy, input, inject, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'watt-segmented-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  styles: `
    :host {
      display: flex;
    }

    a,
    button {
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
      background: none;
      text-decoration: none;
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      font-family: inherit;

      &:hover,
      &:focus-visible {
        background-color: var(--watt-color-neutral-grey-200);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--watt-color-primary-dark);
        position: relative;
        z-index: 1;
      }
    }

    a.active,
    :host(.watt-segmented-button--selected) a,
    :host(.watt-segmented-button--selected) button {
      background-color: var(--watt-color-primary);
      color: var(--watt-color-neutral-white);

      &:hover,
      &:focus-visible {
        background-color: var(--watt-color-primary);
      }
    }

    :host(.watt-segmented-button--disabled) a,
    :host(.watt-segmented-button--disabled) button {
      cursor: default;
      background-color: var(--watt-color-neutral-grey-200);
      color: rgba(
        0,
        0,
        0,
        0.26
      ); /* Not part of Watt foundations — see Figma note on disabled segmented buttons */

      &:hover,
      &:focus-visible {
        background-color: var(--watt-color-neutral-grey-200);
      }
    }

    :host(.watt-segmented-button--disabled.watt-segmented-button--selected) a,
    :host(.watt-segmented-button--disabled.watt-segmented-button--selected) button {
      background-color: var(--watt-color-neutral-grey-400);
      color: var(
        --watt-on-light-high-emphasis
      ); /* Not part of Watt foundations — see Figma note on disabled segmented buttons */

      &:hover,
      &:focus-visible {
        background-color: var(--watt-color-neutral-grey-400);
      }
    }

    :host(.watt-segmented-button--first) a,
    :host(.watt-segmented-button--first) button {
      border-right-width: 0;
      border-radius: 4px 0 0 4px;
    }

    :host(.watt-segmented-button--middle) a,
    :host(.watt-segmented-button--middle) button {
      border-right-width: 0;
      border-radius: 0;
    }

    :host(.watt-segmented-button--last) a,
    :host(.watt-segmented-button--last) button {
      border-radius: 0 4px 4px 0;
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
