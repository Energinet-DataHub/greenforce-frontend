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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { OrganizationStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import type { DhOrganizationsFilters } from '../dh-organizations-filters';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    VaterSpacerComponent,
    VaterStackComponent,
    WATT_FORM_FIELD,
    WattButtonComponent,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
  selector: 'dh-organizations-filters',
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
      *transloco="let t; read: 'marketParticipant.organizationsOverview.filters'"
    >
      <watt-form-field>
        <watt-dropdown
          formControlName="organizationStatus"
          [options]="statusOptions"
          [multiple]="true"
          [chipMode]="true"
          [placeholder]="t('status')"
          dhDropdownTranslator
          translate="marketParticipant.organizationsOverview.status"
        />
      </watt-form-field>

      <vater-spacer />
      <watt-button variant="text" icon="undo" type="reset">{{ t('reset') }}</watt-button>
    </form>
  `,
})
export class DhOrganizationsFiltersComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) initial!: DhOrganizationsFilters;

  @Output() filter = new EventEmitter<DhOrganizationsFilters>();

  formGroup!: FormGroup;

  statusOptions = this.buildOrganizationsStatusOptions();

  ngOnInit() {
    this.formGroup = new FormGroup({
      organizationStatus: dhMakeFormControl<OrganizationStatus[]>(this.initial.organizationStatus),
    });

    this.formGroup.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filter.emit(value));
  }

  private buildOrganizationsStatusOptions(): WattDropdownOptions {
    return Object.keys(OrganizationStatus).map((key) => ({
      displayValue: key,
      value: key,
    }));
  }
}
