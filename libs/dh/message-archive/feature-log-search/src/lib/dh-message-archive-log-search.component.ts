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
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';

import {
  DhMessageArchiveActorDataAccessApiStore,
  DhMessageArchiveDataAccessApiStore,
  DhMessageArchiveDataAccessBlobApiStore,
} from '@energinet-datahub/dh/message-archive/data-access-api';
import { DocumentTypes, BusinessReasons } from '@energinet-datahub/dh/message-archive/domain';
import { ArchivedMessageSearchCriteria } from '@energinet-datahub/dh/shared/domain';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattDatepickerComponent } from '@energinet-datahub/watt/picker/datepicker';
import { WattDateRange, dayjs } from '@energinet-datahub/watt/utils/date';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTimepickerComponent } from '@energinet-datahub/watt/picker/timepicker';

import { DhMessageArchiveLogSearchResultComponent } from './searchresult/dh-message-archive-log-search-result.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-message-archive-log-search',
  styleUrls: ['./dh-message-archive-log-search.component.scss'],
  templateUrl: './dh-message-archive-log-search.component.html',
  providers: [
    DhMessageArchiveDataAccessApiStore,
    DhMessageArchiveDataAccessBlobApiStore,
    DhMessageArchiveActorDataAccessApiStore,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    RxLet,
    RxPush,
    TranslocoDirective,

    WattButtonComponent,
    WattCheckboxComponent,
    WattDatepickerComponent,
    WattTimepickerComponent,
    WattBadgeComponent,
    WattDropdownComponent,
    WattSpinnerComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,

    DhMessageArchiveLogSearchResultComponent,
  ],
})
export class DhMessageArchiveLogSearchComponent {
  private store = inject(DhMessageArchiveDataAccessApiStore);
  private actorStore = inject(DhMessageArchiveActorDataAccessApiStore);
  searchForm = new FormGroup({
    messageId: new FormControl('', { nonNullable: true }),
    documentTypes: new FormControl([], { nonNullable: true }),
    businessReasons: new FormControl([], { nonNullable: true }),
    senderNumber: new FormControl('', { nonNullable: true }),
    receiverNumber: new FormControl('', { nonNullable: true }),
    includeRelated: new FormControl<boolean>(
      { value: false, disabled: true },
      { nonNullable: true }
    ),
    dateRange: new FormControl<WattDateRange>(
      {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
      { nonNullable: true }
    ),
    timeRange: new FormControl<WattDateRange>(
      {
        start: '00:00',
        end: '23:59',
        disabled: true,
      },
      { nonNullable: true }
    ),
  });

  searchResult$ = this.store.searchResult$;
  searching$ = this.store.isSearching$;
  hasSearchError$ = this.store.hasGeneralError$;
  continuationToken$ = this.store.continuationToken$;
  isInit$ = this.store.isInit$;
  getActorOptions$ = this.actorStore.actors$;

  documentTypeFieldOptions: WattDropdownOptions = this.buildDocumentTypeOptions();
  businessReasonFormFieldOptions: WattDropdownOptions = this.buildBusinessTypesOptions();

  searching = false;
  maxItemCount = 100;

  searchCriteria: ArchivedMessageSearchCriteria = {
    dateTimeFrom: '',
    dateTimeTo: '',
    includeRelatedMessages: false,
  };

  constructor() {
    this.actorStore.getActors();
    this.searchForm.valueChanges.subscribe((value) => this.handleState(value));
  }

  private handleState(formChanges: typeof this.searchForm.value): void {
    const { messageId, dateRange } = formChanges;
    const stopEmitEvent = { emitEvent: false };

    if (messageId) {
      this.searchForm.controls.includeRelated.enable(stopEmitEvent);
    } else {
      this.searchForm.controls.includeRelated.disable(stopEmitEvent);
    }

    if (dateRange?.start != '' && dateRange?.end != '') {
      this.searchForm.controls.timeRange.enable(stopEmitEvent);
    } else {
      this.searchForm.controls.timeRange.disable(stopEmitEvent);
    }
  }

  private buildDocumentTypeOptions() {
    return Object.entries(DocumentTypes).map((entry) => ({
      value: entry[0],
      displayValue: `${entry[1]} - ${entry[0]}`,
    }));
  }

  private buildBusinessTypesOptions() {
    return Object.entries(BusinessReasons).map((entry) => ({
      value: entry[0],
      displayValue: `${entry[1]}`,
    }));
  }

  onSubmit() {
    if (this.searchForm.valid === false) return;

    const {
      dateRange,
      messageId,
      receiverNumber,
      senderNumber,
      timeRange,
      documentTypes,
      businessReasons,
      includeRelated,
    } = this.searchForm.value;

    const dateTimeFrom = dayjs(dateRange?.start ?? '')
      .utc()
      .toDate();
    const dateTimeTo = dayjs(dateRange?.end ?? '')
      .utc()
      .toDate();

    this.setRanges(timeRange, dateRange, dateTimeFrom, dateTimeTo);

    Object.assign(this.searchCriteria, {
      dateTimeFrom: dateTimeFrom.toISOString(),
      dateTimeTo: dateTimeTo.toISOString(),
      messageId: messageId === '' ? null : messageId,
      senderNumber: senderNumber === '' ? null : senderNumber,
      receiverNumber: receiverNumber === '' ? null : receiverNumber,
      documentTypes: documentTypes?.length === 0 ? null : documentTypes,
      businessReasons: businessReasons?.length === 0 ? null : businessReasons,
      includeRelatedMessages: includeRelated,
    });

    this.store.searchLogs(this.searchCriteria);
  }

  private setRanges(
    timeRange: WattDateRange | undefined,
    dateRange: WattDateRange | undefined,
    dateTimeFrom: Date,
    dateTimeTo: Date
  ) {
    if (timeRange?.start && timeRange.end && dateRange?.start && dateRange?.end) {
      const [fromHours, fromMinuts] = timeRange.start.split(':');
      const [toHours, toMinutes] = timeRange.end.split(':');

      dateTimeFrom.setHours(Number.parseInt(fromHours));
      dateTimeFrom.setMinutes(Number.parseInt(fromMinuts));

      dateTimeTo.setHours(Number.parseInt(toHours));
      dateTimeTo.setMinutes(Number.parseInt(toMinutes));
    }
  }

  loadMore(continuationToken?: string | null) {
    console.log({ continuationToken });
  }

  resetSearchCriteria() {
    this.store.resetState();

    this.searchForm.reset();
  }
}
