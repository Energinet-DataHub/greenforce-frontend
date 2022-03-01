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

 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { CommonModule } from '@angular/common';
 import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
 import {
  WattButtonModule,
  WattFormFieldModule,
  WattIconModule,
  WattInputModule,
 } from '@energinet-datahub/watt';
 import { DhMessageArchiveDataAccessApiModule } from '@energinet-datahub/dh/message-archive/data-access-api'
 import { SearchCriteria, SearchResultItemDto } from '@energinet-datahub/dh/shared/data-access-api';
 import { LetModule } from '@rx-angular/template';
 import { TranslocoModule } from '@ngneat/transloco';
 import { DhMessageArchiveLogSearchResultScam } from './searchresult/dh-message-archive-log-search-result.component';
 import { BusinessReasonCodes } from '../../../models/businessReasonCodes'
 import { DocumentTypes } from '../../../models/documentTypes'

 @Component({
   changeDetection: ChangeDetectionStrategy.OnPush,
   selector: 'dh-message-archive-log-search',
   styleUrls: ['./dh-message-archive-log-search.component.scss'],
   templateUrl: './dh-message-archive-log-search.component.html',
   providers: [DhMessageArchiveDataAccessApiModule],

 })
 export class DhMessageArchiveLogSearchComponent {
   searchResult$ = this.store.searchResult$;
   searchResultsDtos: Array<SearchResultItemDto> = [];
   businessReasonCodes = BusinessReasonCodes;
   documentTypes = DocumentTypes;
   roleTypes = DocumentTypes;

   searchCriteria: SearchCriteria = {
     messageId: "253698245",
     reasonCode: null,
     dateTimeFrom: "2021-12-01T00:00:00Z",
     dateTimeTo: "2022-03-01T23:59:59Z",
     messageType: null,
    };

   constructor(private store: DhMessageArchiveDataAccessApiModule) {
    this.store.searchResult$.subscribe((searchResult) => {
      this.searchResultsDtos = searchResult;
    })
  }

  onSubmit() {
    console.log("submit triggered");
    if(this.validateSearchParams()) {
      this.store.searchLogs(this.searchCriteria)
    }
  }

  validateSearchParams(): boolean {
    return (this.searchCriteria.dateTimeFrom != null && this.searchCriteria.dateTimeTo != null)
     && (this.searchCriteria.dateTimeFrom.length === 20 && this.searchCriteria.dateTimeTo.length === 20);
  }
}
 @NgModule({
   imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LetModule,
    TranslocoModule,
    DhMessageArchiveLogSearchResultScam,
   ],
   declarations: [DhMessageArchiveLogSearchComponent],
 })
 export class DhMessageArchiveLogSearchScam {}
