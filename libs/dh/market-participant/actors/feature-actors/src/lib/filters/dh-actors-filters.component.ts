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
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime, skip } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { ActorStatus, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { ActorsFilters } from '../actors-filters';
import { only } from 'node:test';

type Form = FormGroup<{
  actorStatus: FormControl<ActorStatus[] | null>;
  marketRoles: FormControl<EicFunction[] | null>;
}>;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RxPush,
    TranslocoDirective,

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
        dhDropdownTranslator
        translate="marketParticipant.actorsOverview.status"
        [formControl]="formGroup.controls.actorStatus"
        [options]="actorStatusOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('status')"
      />

      <watt-dropdown
        dhDropdownTranslator
        translate="marketParticipant.marketRoles"
        [formControl]="formGroup.controls.marketRoles"
        [options]="marketRolesOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('marketRole')"
      />

      <vater-spacer />
      <watt-button variant="text" icon="undo" type="reset" (click)="formReset.emit()">
        {{ t('reset') }}
      </watt-button>
    </form>
  `,
})
export class DhActorsFiltersComponent {
  initial = input.required<ActorsFilters>();

  filter = output<ActorsFilters>();
  formReset = output<void>();

  formGroup = new FormGroup({
    actorStatus: dhMakeFormControl<ActorStatus[]>(),
    marketRoles: dhMakeFormControl<EicFunction[]>(),
  });

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

  constructor() {
    effect(() => {
      this.formGroup.controls.actorStatus.setValue(this.initial().actorStatus, {
        emitEvent: false,
      });
      this.formGroup.controls.marketRoles.setValue(this.initial().marketRoles, {
        emitEvent: false,
      });
      //this.formGroup.setValue({ actorStatus, marketRoles }), { emitEvent: false, onlySelf: true };
    });

    this.formGroup.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(), skip(1))
      .subscribe((value) => this.filter.emit(value as ActorsFilters));
  }
}
