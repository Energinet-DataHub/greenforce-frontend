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
import { Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { WattDateChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDatetimepickerComponent } from '@energinet-datahub/watt/datetimepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattModalActionsComponent, WattModalComponent } from '@energinet-datahub/watt/modal';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { DhMessageArchiveSearchFormService } from './form.service';
import {
  DocumentType,
  GetArchivedMessagesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-message-archive-search-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDateChipComponent,
    WattDatetimepickerComponent,
    WattDropdownComponent,
    WattFilterChipComponent,
    WattFormChipDirective,
    WattModalActionsComponent,
    WattModalComponent,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form.root"
      *transloco="let t; read: 'messageArchive.filters'"
    >
      @if (isSearchingById()) {
        <watt-filter-chip [formControl]="this.form.controls.includeRelated">
          {{ t('includeRelated') }}
        </watt-filter-chip>
      } @else {
        <watt-dropdown
          [formControl]="form.controls.documentTypes"
          [chipMode]="true"
          [multiple]="true"
          [options]="form.documentTypeOptions"
          [placeholder]="t('documentType')"
          [getCustomTrigger]="getDocumentTypeTrigger"
          dhDropdownTranslator
          translateKey="messageArchive.documentType"
        />

        <watt-dropdown
          [formControl]="form.controls.businessReasons"
          [chipMode]="true"
          [multiple]="true"
          [options]="form.businessReasonOptions"
          [placeholder]="t('businessReason')"
          [getCustomTrigger]="getBusinessReasonTrigger"
          dhDropdownTranslator
          translateKey="messageArchive.businessReason"
        />

        @if (form.isActorControlsEnabled()) {
          <watt-dropdown
            [formControl]="form.controls.senderId"
            [chipMode]="true"
            [options]="form.actorOptions()"
            [placeholder]="t('sender')"
          />

          <watt-dropdown
            [formControl]="form.controls.receiverId"
            [chipMode]="true"
            [options]="form.actorOptions()"
            [placeholder]="t('receiver')"
          />
        }

        <watt-date-chip [formControl]="form.controls.start" [placeholder]="t('start')" />

        <watt-date-chip [formControl]="form.controls.end" [placeholder]="t('end')" />
      }

      <vater-spacer />

      <watt-button variant="text" icon="undo" (click)="reset()">{{ t('reset') }}</watt-button>
    </form>
  `,
})
export class DhMessageArchiveSearchFiltersComponent {
  isSearchingById = input(false);
  filter = output<GetArchivedMessagesQueryVariables>();
  clear = output();

  form = inject(DhMessageArchiveSearchFormService);

  // value is always an array since dropdown is in `multiple` mode
  getDocumentTypeTrigger = (value: string | string[]) =>
    this.form.getDocumentTypeIdentifier(value[0] as DocumentType);

  // value is always an array since dropdown is in `multiple` mode
  getBusinessReasonTrigger = (value: string | string[]) => value[0];

  filterEffect = effect(() => this.filter.emit(this.form.values()));

  reset = () => {
    this.form.reset();
    this.clear.emit();
  };
}
