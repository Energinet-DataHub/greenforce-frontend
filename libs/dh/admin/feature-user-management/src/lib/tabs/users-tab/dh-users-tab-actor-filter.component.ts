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
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattDropdownModule } from '@energinet-datahub/watt/dropdown';

@Component({
  selector: 'dh-users-tab-actor-filter',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      <watt-form-field class="actor-search-field">
        <watt-label>{{ t('filter.actor') }}</watt-label>
        <watt-dropdown
          [placeholder]="t('searchActorPlaceHolder')"
          [formControl]="actorControl"
          [options]="(actorOptions)"
          [multiple]="false"
        ></watt-dropdown>
      </watt-form-field>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .actor-search-field {
        width: 30rem;
      }
    `,
  ],
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    WattFormFieldModule,
    WattDropdownModule,
  ],
})
export class DhUsersTabActorFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  actorControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  @Input() actorOptions: { value: string, displayValue: string }[];
  @Output() changed = new EventEmitter<string | undefined>();

  constructor() {
    this.actorOptions = [];
  }

  ngOnInit(): void {
    this.actorControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.changed.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
