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
  signal,
  inject,
  ElementRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type WattSegmentedButtonPosition = 'first' | 'middle' | 'last' | 'standalone';

@Component({
  selector: 'watt-segmented-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgTemplateOutlet],
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
      border-radius: 4px;
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
      &:focus-visible,
      :host(.hover) & {
        background-color: var(--watt-color-neutral-grey-200);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--watt-color-primary-dark);
        position: relative;
        z-index: 1;
      }

      &[aria-checked='true'],
      &.active,
      :host(.selected) & {
        background-color: var(--watt-color-primary);
        color: var(--watt-color-neutral-white);

        &:hover,
        &:focus-visible {
          background-color: var(--watt-color-primary);
        }
      }

      &[aria-disabled='true'],
      &:disabled,
      :host(.disabled) & {
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
    }

    :host(.disabled.selected) a,
    :host(.disabled.selected) button,
    :host(.disabled) a[aria-checked='true'],
    :host(.disabled) button[aria-checked='true'],
    a[aria-disabled='true'][aria-checked='true'],
    button:disabled[aria-checked='true'] {
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
    :host(.watt-segmented-button--first) button,
    :host(.start) a,
    :host(.start) button {
      border-right-width: 0;
      border-radius: 4px 0 0 4px;
    }

    :host(.watt-segmented-button--middle) a,
    :host(.watt-segmented-button--middle) button,
    :host(.middle) a,
    :host(.middle) button {
      border-right-width: 0;
      border-radius: 0;
    }

    :host(.watt-segmented-button--last) a,
    :host(.watt-segmented-button--last) button,
    :host(.end) a,
    :host(.end) button {
      border-radius: 0 4px 4px 0;
    }
  `,
  host: {
    '[class.watt-segmented-button--first]': 'position() === "first"',
    '[class.watt-segmented-button--middle]': 'position() === "middle"',
    '[class.watt-segmented-button--last]': 'position() === "last"',
  },
  template: `
    <ng-template #labelTemplate><ng-content /></ng-template>

    @if (link()) {
      <a
        role="radio"
        [routerLink]="disabled() ? null : link()"
        queryParamsHandling="merge"
        routerLinkActive
        #rla="routerLinkActive"
        [class.active]="rla.isActive"
        [attr.aria-checked]="selected() || rla.isActive"
        [attr.aria-disabled]="disabled() ? true : null"
        [attr.tabindex]="tabIndex()"
      >
        <ng-container *ngTemplateOutlet="labelTemplate" />
      </a>
    } @else {
      <button
        type="button"
        role="radio"
        [attr.aria-checked]="selected()"
        [attr.tabindex]="tabIndex()"
        [disabled]="disabled()"
        (click)="onClick()"
      >
        <ng-container *ngTemplateOutlet="labelTemplate" />
      </button>
    }
  `,
})
export class WattSegmentedButtonComponent {
  value = input<string>();
  link = input<string>();

  selected = signal(false);
  disabled = signal(false);
  position = signal<WattSegmentedButtonPosition>('standalone');
  tabIndex = signal(0);

  private readonly elementRef = inject(ElementRef);

  focus(): void {
    const host = this.elementRef.nativeElement as HTMLElement;
    const interactive = host.querySelector<HTMLElement>('a, button');
    interactive?.focus();
  }

  onClick(): void {
    if (this.disabled()) return;
    const value = this.value();
    if (value === undefined) return;
    this.elementRef.nativeElement.dispatchEvent(
      new CustomEvent('segmentSelect', { bubbles: true, detail: value })
    );
  }
}
