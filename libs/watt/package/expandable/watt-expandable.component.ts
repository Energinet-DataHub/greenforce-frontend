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
import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { WattIconComponent } from '@energinet/watt/icon';

/**
 * Usage:
 * `import { WattExpandableComponent } from '@energinet/watt/expandable';`
 *
 * A lightweight inline collapsible/disclosure. Unlike `WattExpandableCardComponent`,
 * this component renders no card chrome, only a clickable label row with a chevron
 * and the projected content below.
 */
@Component({
  selector: 'watt-expandable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattIconComponent],
  styleUrl: './watt-expandable.component.scss',
  template: `
    <button
      type="button"
      class="watt-expandable__header"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="contentId"
      (click)="toggle()"
    >
      <watt-icon name="down" size="s" class="watt-expandable__chevron" [attr.aria-hidden]="true" />
      <span class="watt-expandable__label">{{ currentLabel() }}</span>
    </button>

    <div
      [id]="contentId"
      class="watt-expandable__body"
      [class.watt-expandable__body--expanded]="expanded()"
      [attr.inert]="expanded() ? null : true"
    >
      <div class="watt-expandable__body-inner">
        <ng-content />
      </div>
    </div>
  `,
  host: {
    class: 'watt-expandable',
    '[class.watt-expandable--expanded]': 'expanded()',
  },
})
export class WattExpandableComponent {
  /**
   * @ignore
   * Counter for unique `contentId` generation. Matches the static-counter
   * pattern used by other Watt form components (see `WattDatepickerComponent`,
   * `WattTimepickerComponent`). The IDs are not SSR-hydration-safe; if Watt
   * ever enables SSR this needs to switch to Angular's `_IdGenerator` or
   * deferred assignment.
   */
  private static nextId = 0;

  /** Whether the expandable is expanded. Supports two-way binding via `[(expanded)]`. */
  expanded = model(false);

  /** Label shown when the content is collapsed (e.g. "Vis mulige handlinger"). */
  labelCollapsed = input.required<string>();

  /**
   * Label shown when the content is expanded (e.g. "Skjul mulige handlinger").
   * Optional. If omitted, the collapsed label is shown in both states, leaving the
   * chevron rotation as the only visual state cue (screen readers still get
   * `aria-expanded` for state).
   */
  labelExpanded = input<string>();

  /**
   * @ignore
   */
  readonly contentId = `watt-expandable-content-${WattExpandableComponent.nextId++}`;

  /**
   * @ignore
   */
  currentLabel = computed(() =>
    this.expanded() ? (this.labelExpanded() ?? this.labelCollapsed()) : this.labelCollapsed()
  );

  /**
   * @ignore
   */
  toggle(): void {
    this.expanded.update((value) => !value);
  }
}
