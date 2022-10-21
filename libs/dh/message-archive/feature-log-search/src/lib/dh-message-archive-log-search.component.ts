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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { Subject } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import {
  WattButtonModule,
  WattFormFieldModule,
  WattInputModule,
  WattCheckboxModule,
  WattDropdownModule,
  WattDropdownOptions,
  WattSpinnerModule,
} from '@energinet-datahub/watt';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import {
  DhMessageArchiveDataAccessApiStore,
  DhMessageArchiveDataAccessBlobApiStore,
} from '@energinet-datahub/dh/message-archive/data-access-api';
import {
  MessageArchiveSearchCriteria,
  MessageArchiveSearchResultItemDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  ProcessTypes,
  DocumentTypes,
} from '@energinet-datahub/dh/message-archive/domain';

import { DhMessageArchiveLogSearchResultScam } from './searchresult/dh-message-archive-log-search-result.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-message-archive-log-search',
  styleUrls: ['./dh-message-archive-log-search.component.scss'],
  templateUrl: './dh-message-archive-log-search.component.html',
  providers: [
    DhMessageArchiveDataAccessApiStore,
    DhMessageArchiveDataAccessBlobApiStore,
  ],
})
export class DhMessageArchiveLogSearchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private regexLogNameWithDateFolder = new RegExp(
    /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\/.*/
  );
  private regexLogNameIsSingleGuid = new RegExp(
    /[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}$/
  );

  searchResult$ = this.store.searchResult$;
  searching$ = this.store.isSearching$;
  hasSearchError$ = this.store.hasGeneralError$;
  continuationToken$ = this.store.continuationToken$;

  rsmFormFieldOptions: WattDropdownOptions = this.buildRsmOptions();
  processTypeFormFieldOptions: WattDropdownOptions =
    this.buildProcessTypesOptions();
  searching = false;
  maxItemCount = 100;
  searchCriteria: MessageArchiveSearchCriteria = {
    maxItemCount: this.maxItemCount,
    includeRelated: false,
    includeResultsWithoutContent: false,
  };

  private initDateFrom = (): Date => {
    const from = new Date();
    from.setUTCMonth(new Date().getMonth() - 1);
    from.setUTCHours(0, 0, 0);
    return from;
  };
  private initDateTo = (): Date => {
    const to = new Date();
    to.setUTCHours(23, 59, 59);
    return to;
  };

  constructor(
    private store: DhMessageArchiveDataAccessApiStore,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private logStore: DhMessageArchiveDataAccessBlobApiStore
  ) {
    this.resetSearchCritera();

    this.currentRoute.queryParamMap.subscribe((q) => {
      this.searchCriteria.traceId = q.has('traceId') ? q.get('traceId') : null;
      this.searchCriteria.functionName = q.has('functionName')
        ? q.get('functionName')
        : null;
      this.searchCriteria.invocationId = q.has('invocationId')
        ? q.get('invocationId')
        : null;
    });
  }

  private buildRsmOptions() {
    return Object.entries(DocumentTypes).map((entry) => {
      return {
        value: entry[0],
        displayValue: entry[1] + ' - ' + entry[0],
      };
    });
  }

  private buildProcessTypesOptions() {
    return Object.entries(ProcessTypes).map((entry) => {
      return {
        value: entry[0],
        displayValue: entry[0] + ' - ' + entry[1],
      };
    });
  }

  onSubmit(searching: boolean) {
    if (!searching && this.validateSearchParams()) {
      this.searchCriteria.continuationToken = null;

      if (!this.searchCriteria.messageId) {
        this.searchCriteria.includeRelated = false;
      }

      this.store.searchLogs(this.searchCriteria);
    }
  }

  loadMore(searching: boolean, continuationToken?: string | null) {
    if (!searching && this.validateSearchParams() && continuationToken) {
      this.store.searchLogs({ ...this.searchCriteria, continuationToken });
    }
  }

  resetSearchCritera() {
    this.store.resetState();
    this.searchCriteria = {
      messageId: null,
      rsmNames: new Array<string>(),
      includeRelated: false,
      traceId: null,
      functionName: null,
      invocationId: null,
      maxItemCount: this.maxItemCount,
      processTypes: new Array<string>(),
      includeResultsWithoutContent: false,
    };
    this.searchCriteria.dateTimeFrom =
      this.initDateFrom().toISOString().split('.')[0] + 'Z';
    this.searchCriteria.dateTimeTo =
      this.initDateTo().toISOString().split('.')[0] + 'Z';
  }

  redirectToDownloadLogPage(resultItem: MessageArchiveSearchResultItemDto) {
    const logName = this.findLogName(resultItem.blobContentUri);
    const encodedLogName = encodeURIComponent(logName);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/message-archive/${encodedLogName}`])
    );
    const logViewWindow = window.open(url, '_blank');
    logViewWindow?.sessionStorage.setItem(
      'messageId',
      resultItem.messageId ?? ''
    );
    logViewWindow?.sessionStorage.setItem('traceId', resultItem.traceId ?? '');
  }

  downloadLog(resultItem: MessageArchiveSearchResultItemDto) {
    const logName = this.findLogName(resultItem.blobContentUri);
    this.logStore.downloadLogFile(logName);
  }

  validateSearchParams(): boolean {
    return (
      this.searchCriteria.dateTimeFrom != null &&
      this.searchCriteria.dateTimeTo != null &&
      this.searchCriteria.dateTimeFrom.length === 20 &&
      this.searchCriteria.dateTimeTo.length === 20
    );
  }

  findLogName(logUrl: string): string {
    if (this.regexLogNameWithDateFolder.test(logUrl)) {
      const match = this.regexLogNameWithDateFolder.exec(logUrl);
      return match != null ? match[0] : '';
    } else if (this.regexLogNameIsSingleGuid.test(logUrl)) {
      const match = this.regexLogNameIsSingleGuid.exec(logUrl);
      return match != null ? match[0] : '';
    }

    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
@NgModule({
  imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattCheckboxModule,
    FormsModule,
    CommonModule,
    LetModule,
    TranslocoModule,
    DhMessageArchiveLogSearchResultScam,
    WattBadgeModule,
    WattDropdownModule,
    WattSpinnerModule,
  ],
  declarations: [DhMessageArchiveLogSearchComponent],
})
export class DhMessageArchiveLogSearchScam {}
