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
import { Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet-datahub/watt/chip';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { DhMessageArchiveSearchFormService } from './form.service';
import {
  DocumentType,
  GetArchivedMessagesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { getDocumentTypeIdentifier } from '@energinet-datahub/dh/message-archive/domain';

@Component({
  selector: 'dh-message-archive-search-filters',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    WattDateRangeChipComponent,
    WattDropdownComponent,
    WattFilterChipComponent,
    WattFormChipDirective,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      vater-stack
      scrollable
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
        <watt-date-range-chip [formControl]="form.controls.created">
          {{ t('dateRange') }}
        </watt-date-range-chip>

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
      }
    </form>
  `,
})
export class DhMessageArchiveSearchFiltersComponent {
  isSearchingById = input(false);
  filter = output<GetArchivedMessagesQueryVariables>();

  form = inject(DhMessageArchiveSearchFormService);

  // value is always an array since dropdown is in `multiple` mode
  getDocumentTypeTrigger = (value: string | string[]) =>
    getDocumentTypeIdentifier(value[0] as DocumentType);

  // value is always an array since dropdown is in `multiple` mode
  getBusinessReasonTrigger = (value: string | string[]) => value[0];

  filterEffect = effect(() => this.filter.emit(this.form.values()));
}
