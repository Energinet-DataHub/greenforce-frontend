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
 * `import { WattExpandableLinkComponent } from '@energinet/watt/expandable-link';`
 *
 * A lightweight inline collapsible/disclosure styled as a link. Unlike
 * `WattExpandableCardComponent`, this component renders no card chrome,
 * only a clickable link-styled label row with a chevron and the projected
 * content below.
 */
@Component({
  selector: 'watt-expandable-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattIconComponent],
  styleUrl: './watt-expandable-link.component.scss',
  template: `
    <button
      type="button"
      class="watt-expandable-link__header"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="contentId"
      (click)="toggle()"
    >
      <watt-icon
        name="down"
        size="s"
        class="watt-expandable-link__chevron"
        [attr.aria-hidden]="true"
      />
      <span>{{ currentLabel() }}</span>
    </button>

    <div
      [id]="contentId"
      class="watt-expandable-link__body"
      [class.watt-expandable-link__body--expanded]="expanded()"
      [attr.inert]="expanded() ? null : true"
    >
      <div class="watt-expandable-link__body-inner">
        <ng-content />
      </div>
    </div>
  `,
  host: {
    class: 'watt-expandable-link',
    '[class.watt-expandable-link--expanded]': 'expanded()',
  },
})
export class WattExpandableLinkComponent {
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

  /** Label shown when the content is collapsed (e.g. "Vis indhold"). */
  labelCollapsed = input.required<string>();

  /**
   * Label shown when the content is expanded (e.g. "Skjul indhold").
   * Optional. If omitted, the collapsed label is shown in both states, leaving the
   * chevron rotation as the only visual state cue (screen readers still get
   * `aria-expanded` for state).
   */
  labelExpanded = input<string>();

  /**
   * @ignore
   */
  readonly contentId = `watt-expandable-link-content-${WattExpandableLinkComponent.nextId++}`;

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
