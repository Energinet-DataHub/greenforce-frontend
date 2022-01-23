/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { PushModule } from '@rx-angular/template';
import { TranslocoModule } from '@ngneat/transloco';

import { DhTestClientDataAccessApiStore } from '@energinet-datahub/dh/test-client/data-access-api';
import { WattEmptyStateModule } from '@energinet-datahub/watt';

import { DhSendRawMessageSearchFormScam } from './form/dh-send-raw-message-search-form.component';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-send-raw-message-search',
  styleUrls: ['./dh-send-raw-message-search.component.scss'],
  templateUrl: './dh-send-raw-message-search.component.html',
  providers: [DhTestClientDataAccessApiStore],
})
export class DhSendRawMessageSearchComponent {
  isLoading$ = this.store.isLoading$;
  notFound$ = this.store.sendMessageNotFound$;
  hasError$ = this.store.hasError$;
  sendMessageLoaded$ = this.store.sendMessageTemplate$.pipe(take(1));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: DhTestClientDataAccessApiStore
  ) {}

  onSubmit(id: string) {
    console.warn('test submit:'+id);
    this.store.getSendMessageTemplate(id);

    this.sendMessageLoaded$.subscribe(() => {
      this.onGetSendMessageTemplateLoaded(id);
    });
  }

  private onGetSendMessageTemplateLoaded(Id?: string) {
    this.router.navigate([`../${Id}`], { relativeTo: this.route });
  }
}

@NgModule({
  imports: [
    DhSendRawMessageSearchFormScam,
    WattEmptyStateModule,
    TranslocoModule,
    PushModule,
    CommonModule,
  ],
  declarations: [DhSendRawMessageSearchComponent],
})
export class DhSendRawMessageSearchScam {}
