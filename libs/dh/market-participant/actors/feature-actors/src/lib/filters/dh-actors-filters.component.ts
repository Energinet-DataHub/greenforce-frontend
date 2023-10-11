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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Observable, Subscription, debounceTime, map } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { ActorStatus, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { ActorsFilters } from '../actors-filters';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    RxPush,

    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
  selector: 'dh-actors-filters',
  styles: [
    `
      :host {
        display: block;
      }

      form {
        overflow-y: hidden;
      }

      watt-dropdown {
        width: auto;
      }
    `,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="m"
      tabindex="-1"
      [formGroup]="formGroup"
      *transloco="let t; read: 'marketParticipant.actorsOverview.filters'"
    >
      <watt-dropdown
        formControlName="actorStatus"
        [options]="actorStatusOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('status')"
      />

      <watt-dropdown
        formControlName="marketRoles"
        [options]="marketRolesOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('marketRole')"
      />

      <vater-spacer />
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

  actorStatusOptions = Object.keys(ActorStatus)
    .filter((key) => !(key === ActorStatus.New || key === ActorStatus.Passive))
    .map((key) => ({
      displayValue: key,
      value: key,
    }));

  marketRolesOptions = Object.keys(EicFunction).map((marketRole) => ({
    value: marketRole,
    displayValue: marketRole,
  }));

  ngOnInit() {
    this.formGroup = new FormGroup({
      actorStatus: dhMakeFormControl<ActorStatus[]>(this.initial.actorStatus),
      marketRoles: dhMakeFormControl<EicFunction[]>(this.initial.marketRoles),
    });

    this.formGroupSubscription = this.formGroup.valueChanges
      .pipe(debounceTime(250))
      .subscribe((value) => this.filter.emit(value));
  }

  ngOnDestroy() {
    this.formGroupSubscription?.unsubscribe();
  }
}
