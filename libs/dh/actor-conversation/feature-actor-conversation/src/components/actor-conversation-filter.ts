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
  output,
  computed,
  Component,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { dhFormToSignal, dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { ConversationSubject } from '@energinet-datahub/dh/shared/domain/graphql';

import { VATER } from '@energinet/watt/vater';
import { WATT_MENU } from '@energinet/watt/menu';
import { WattChipComponent } from '@energinet/watt/chip';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattSimpleSearchComponent } from '@energinet/watt/search';

export type ActorConversationFilterValue = {
  search: string;
  ownCases: boolean;
  showOnlyUnread: boolean;
  statusActive: boolean;
  statusClosed: boolean;
  subjects: ConversationSubject[];
};

type FilterChipKey =
  | 'ownCases'
  | 'showOnlyUnread'
  | 'statusActive'
  | 'statusClosed'
  | `subject:${ConversationSubject}`;

type FilterChip = {
  key: FilterChipKey;
  label: string;
};

@Component({
  selector: 'dh-actor-conversation-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VATER,
    WATT_MENU,
    WattChipComponent,
    WattButtonComponent,
    WattSimpleSearchComponent,
    WattCheckboxComponent,
  ],
  styles: `
    :host {
      width: 100%;

      .watt-space-inset-m {
        watt-checkbox {
          width: 100%;
        }
      }

      watt-simple-search {
        width: 100%;
      }
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPoint.actorConversation'">
      <vater-stack direction="column" gap="m" fill="horizontal">
        <vater-stack direction="row" gap="s" justify="space-between" fill="horizontal">
          <watt-simple-search [label]="t('searchPlaceholder')" (search)="search($event)" />
          <watt-button icon="filter" variant="secondary" [wattMenuTriggerFor]="filterMenu" />

          <watt-menu #filterMenu>
            <vater-stack align="start" gap="m" fill="horizontal" class="watt-space-inset-m">
              <watt-checkbox
                (click)="$event.stopPropagation()"
                [formControl]="form.controls.ownCases"
              >
                {{ t('filters.ownCases') }}
              </watt-checkbox>
              <watt-checkbox
                (click)="$event.stopPropagation()"
                [formControl]="form.controls.showOnlyUnread"
              >
                {{ t('filters.showOnlyUnread') }}
              </watt-checkbox>
            </vater-stack>

            <watt-menu-group [label]="t('filters.status')">
              <vater-stack align="start" gap="m" fill="horizontal" class="watt-space-inset-m">
                <watt-checkbox
                  (click)="$event.stopPropagation()"
                  [formControl]="form.controls.statusActive"
                >
                  {{ t('active') }}
                </watt-checkbox>

                <watt-checkbox
                  (click)="$event.stopPropagation()"
                  [formControl]="form.controls.statusClosed"
                >
                  {{ t('closed') }}
                </watt-checkbox>
              </vater-stack>
            </watt-menu-group>

            <watt-menu-group [label]="t('subjectLabel')">
              <vater-stack align="start" gap="m" fill="horizontal" class="watt-space-inset-m">
                @for (subject of subjects; track subject) {
                  <watt-checkbox
                    (click)="$event.stopPropagation()"
                    [formControl]="subjectControls[subject]"
                  >
                    {{ t('subjects.' + subject) }}
                  </watt-checkbox>
                }
              </vater-stack>
            </watt-menu-group>
          </watt-menu>
        </vater-stack>

        @if (activeFilterChips().length > 0) {
          <vater-stack direction="row" gap="s" align="start" wrap fill="horizontal">
            @for (chip of activeFilterChips(); track chip.key) {
              <watt-chip [selected]="true" (click)="removeFilter(chip.key)" variant="dismissible">{{
                chip.label
              }}</watt-chip>
            }
          </vater-stack>
        }
      </vater-stack>
    </ng-container>
  `,
})
export class ActorConversationFilter {
  private transloco = inject(TranslocoService);

  filterChange = output<ActorConversationFilterValue>();

  subjects = Object.values(ConversationSubject);

  subjectControls = Object.fromEntries(
    Object.values(ConversationSubject).map((subject) => [subject, dhMakeFormControl(false)])
  );

  form = new FormGroup({
    search: dhMakeFormControl(''),
    ownCases: dhMakeFormControl(false),
    showOnlyUnread: dhMakeFormControl(false),
    statusActive: dhMakeFormControl(false),
    statusClosed: dhMakeFormControl(false),
    subjects: new FormGroup(this.subjectControls),
  });

  private formValue = dhFormToSignal(this.form);

  constructor() {
    effect(() => {
      const value = this.formValue();

      const subjects = Object.entries(this.subjectControls)
        .filter(([, ctrl]) => ctrl.value)
        .map(([subject]) => subject as ConversationSubject);

      this.filterChange.emit({
        search: value.search ?? '',
        ownCases: value.ownCases ?? false,
        showOnlyUnread: value.showOnlyUnread ?? false,
        statusActive: value.statusActive ?? false,
        statusClosed: value.statusClosed ?? false,
        subjects,
      });
    });
  }

  search(search: string) {
    this.form.controls.search.setValue(search);
  }

  activeFilterChips = computed(() => {
    const chips: FilterChip[] = [];
    const value = this.formValue();

    if (value.ownCases) {
      chips.push({
        key: 'ownCases',
        label: this.transloco.translate('meteringPoint.actorConversation.filters.ownCases'),
      });
    }
    if (value.showOnlyUnread) {
      chips.push({
        key: 'showOnlyUnread',
        label: this.transloco.translate('meteringPoint.actorConversation.filters.showOnlyUnread'),
      });
    }
    if (value.statusActive) {
      chips.push({
        key: 'statusActive',
        label: this.transloco.translate('meteringPoint.actorConversation.active'),
      });
    }
    if (value.statusClosed) {
      chips.push({
        key: 'statusClosed',
        label: this.transloco.translate('meteringPoint.actorConversation.closed'),
      });
    }

    // Add subject chips
    for (const subject of this.subjects) {
      if (value.subjects?.[subject]) {
        chips.push({
          key: `subject:${subject}`,
          label: this.transloco.translate(`meteringPoint.actorConversation.subjects.${subject}`),
        });
      }
    }

    return chips;
  });

  removeFilter(key: FilterChipKey): void {
    if (key.startsWith('subject:')) {
      const subject = key.replace('subject:', '') as ConversationSubject;
      this.subjectControls[subject].setValue(false);
    } else {
      const control =
        this.form.controls[key as 'ownCases' | 'showOnlyUnread' | 'statusActive' | 'statusClosed'];
      control.setValue(false);
    }
  }
}
