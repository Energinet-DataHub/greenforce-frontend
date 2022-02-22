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

 import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { CommonModule } from '@angular/common';
 import { ChangeDetectionStrategy, Component, NgModule, ViewChild, ElementRef } from "@angular/core";
 import {
  WattButtonModule,
  WattFormFieldModule,
  WattIconModule,
  WattInputModule,
 } from '@energinet-datahub/watt';
 import { DhMessageArchiveDataAccessApiModule } from '@energinet-datahub/dh/message-archive/data-access-api'
 import { SearchCriteria, SearchResultItemDto } from '@energinet-datahub/dh/shared/data-access-api';
 import { LetModule } from '@rx-angular/template';

 @Component({
   changeDetection: ChangeDetectionStrategy.OnPush,
   selector: 'dh-message-archive-log-search',
   styleUrls: ['./dh-message-archive-log-search.component.scss'],
   templateUrl: './dh-message-archive-log-search.component.html',
   providers: [DhMessageArchiveDataAccessApiModule],

 })
 export class DhMessageArchiveLogSearchComponent {
   searchResult$ = this.searchApi.searchResult$;
   searchResultsDtos: Array<SearchResultItemDto> = [];

   searchControl = new FormControl();
   @ViewChild('searchInputMessageId') searchInputMessageId?: ElementRef;

   constructor(private searchApi: DhMessageArchiveDataAccessApiModule) {
    this.searchApi.searchResult$.subscribe((searchResult) => {
      this.searchResultsDtos = searchResult;
    })
  }

  onSubmit() {
    console.log("submit triggered");
    if(this.validateSearchParams()) {
      const id = this.searchInputMessageId?.nativeElement.value;
      const searchCriteria:SearchCriteria = { messageId: id };
      this.searchApi.searchLogs(searchCriteria)
    }
  }

  validateSearchParams(): boolean {
    const id = this.searchInputMessageId?.nativeElement.value;
    return id != "";
  }

  ngAfterViewInit() {
    if(this.searchInputMessageId) {
      this.searchInputMessageId.nativeElement.value = "253698245";
      this.searchInputMessageId.nativeElement.focus();
    }
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
    LetModule
   ],
   declarations: [DhMessageArchiveLogSearchComponent],
 })
 export class DhMessageArchiveLogSearchScam {}
