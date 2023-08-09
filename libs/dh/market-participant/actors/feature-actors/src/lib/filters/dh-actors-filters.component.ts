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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Observable, Subscription, debounceTime, map } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  WattDropdownComponent,
  WattDropdownOption,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import { MarketParticipantEicFunction } from '@energinet-datahub/dh/shared/domain';
import { ActorStatus } from '@energinet-datahub/dh/shared/domain/graphql';

import { ActorsFilters } from '../actors-filters';

/** Helper function for creating form control with `nonNullable` based on value. */
const makeFormControl = <T>(value: T | null = null) =>
  new FormControl(value, { nonNullable: Boolean(value) });

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    RxPush,
    WATT_FORM_FIELD,
    WattButtonComponent,
    WattDropdownComponent,
  ],
  selector: 'dh-actors-filters',
  styles: [
    `
      :host {
        display: block;
      }

      form {
        display: flex;
        gap: 1rem;
        align-items: center;
        overflow: auto;
        overflow-y: hidden;
      }

      watt-button {
        margin-left: auto;
      }
    `,
  ],
  template: `
    <form
      [formGroup]="formGroup"
      *transloco="let t; read: 'marketParticipant.actorsOverview.filters'"
    >
      <watt-form-field>
        <watt-dropdown
          formControlName="actorStatus"
          [options]="actorStatusOptions"
          [multiple]="true"
          [chipMode]="true"
          [placeholder]="t('status')"
        />
      </watt-form-field>

      <watt-form-field>
        <watt-dropdown
          formControlName="marketRole"
          [options]="marketRolesOptions | push"
          [multiple]="true"
          [chipMode]="true"
          [placeholder]="t('marketRole')"
        />
      </watt-form-field>

      <watt-button variant="text" icon="undo" type="reset">{{ t('reset') }}</watt-button>
    </form>
  `,
})
export class DhActorsFiltersComponent implements OnInit, OnDestroy {
  private transloco = inject(TranslocoService);
  private formGroupSubscription?: Subscription;

  @Input({ required: true }) initial!: ActorsFilters;
  @Output() filter = new EventEmitter<ActorsFilters>();

  formGroup!: FormGroup;

  actorStatusOptions: WattDropdownOptions = this.buildActorStatusOptions();
  marketRolesOptions = this.buildMarketRolesOptions();

  ngOnInit() {
    this.formGroup = new FormGroup({
      actorStatus: makeFormControl<ActorStatus[] | null>(this.initial.actorStatus),
      marketRole: makeFormControl<MarketParticipantEicFunction[] | null>(this.initial.marketRoles),
    });

    this.formGroupSubscription = this.formGroup.valueChanges
      .pipe(debounceTime(250))
      .subscribe((value) => this.filter.emit(value));
  }

  ngOnDestroy() {
    this.formGroupSubscription?.unsubscribe();
  }

  private buildActorStatusOptions(): WattDropdownOptions {
    return Object.keys(ActorStatus).map((key) => ({
      displayValue: key,
      value: key,
    }));
  }

  private buildMarketRolesOptions(): Observable<WattDropdownOptions> {
    return this.transloco.selectTranslateObject('marketParticipant.marketRoles').pipe(
      map((marketRolesTranslations) =>
        Object.keys(MarketParticipantEicFunction).map(
          (marketRole): WattDropdownOption => ({
            value: marketRole,
            displayValue: marketRolesTranslations[marketRole],
          })
        )
      )
    );
  }
}
