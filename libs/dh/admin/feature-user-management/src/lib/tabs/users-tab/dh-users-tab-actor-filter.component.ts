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
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';

@Component({
  selector: 'dh-users-tab-actor-filter',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      <watt-dropdown
        [label]="t('filter.actor')"
        [placeholder]="t('searchActorPlaceHolder')"
        [formControl]="actorControl"
        [options]="actorOptions"
        [multiple]="false"
      ></watt-dropdown>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        watt-dropdown {
          width: 15rem;
        }
      }
    `,
  ],
  imports: [TranslocoModule, ReactiveFormsModule, WattDropdownComponent],
})
export class DhUsersTabActorFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  actorControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  @Input() actorOptions: { value: string; displayValue: string }[];
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
