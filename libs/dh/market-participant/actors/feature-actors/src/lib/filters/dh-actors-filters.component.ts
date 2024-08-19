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
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime } from 'rxjs';
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
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';

import { ActorsFilters } from '../actors-filters';

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
    WattQueryParamsDirective,

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
      gap="s"
      tabindex="-1"
      [formGroup]="formGroup"
      wattQueryParams
      *transloco="let t; read: 'marketParticipant.actorsOverview.filters'"
    >
      <watt-dropdown
        dhDropdownTranslator
        translateKey="marketParticipant.actorsOverview.status"
        [formControl]="formGroup.controls.actorStatus"
        [options]="actorStatusOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('status')"
      />

      <watt-dropdown
        dhDropdownTranslator
        translateKey="marketParticipant.marketRoles"
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
export class DhActorsFiltersComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) initial!: ActorsFilters;

  @Output() filter = new EventEmitter<ActorsFilters>();
  @Output() formReset = new EventEmitter<void>();

  formGroup!: Form;

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

    this.formGroup.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filter.emit(value as ActorsFilters));
  }
}
