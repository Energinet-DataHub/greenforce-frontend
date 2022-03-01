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
 import { RoleTypes } from '../../../models/roleTypes'

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
   roleTypes = RoleTypes;

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

  downloadBlob(resultItem: SearchResultItemDto) {
    const testName = "2022-03-01/ChargeLinksIngestion_e009b9b2-edce-4f74-b466-98d0bbb0a94a_0875f7db-1d25-4605-a288-8e7aebccf7af_00-1d55125ce0dcac49a16ce5701d1e10db-e2c2ca4a8e13db44-00_5195bd2c-d59d-4dfb-93d3-f584b4860256_2022-03-01T11-50-38Z_request.txt";
    this.store.downloadLog(testName);
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
