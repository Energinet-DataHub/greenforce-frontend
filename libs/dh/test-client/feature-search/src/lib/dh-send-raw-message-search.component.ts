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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Subject, take, takeUntil, tap } from 'rxjs';
import { PushModule } from '@rx-angular/template';
import { TranslocoModule } from '@ngneat/transloco';

import { DhTestClientDataAccessApiStore } from '@energinet-datahub/dh/test-client/data-access-api';
import { WattEmptyStateModule } from '@energinet-datahub/watt';

import { DhSendRawMessageSearchFormScam } from './form/dh-send-raw-message-search-form.component';
import { SendMessageTemplateDTO, SendMessageTemplateListDTO } from '@energinet-datahub/dh/shared/data-access-api';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-send-raw-message-search',
  styleUrls: ['./dh-send-raw-message-search.component.scss'],
  templateUrl: './dh-send-raw-message-search.component.html',
  providers: [DhTestClientDataAccessApiStore],
})
export class DhSendRawMessageSearchComponent implements OnInit {
  //private destroy$ = new Subject<void>();
  isLoading$ = this.store.isLoading$;
  // notFound$ = this.store.sendMessageNotFound$;
  // hasError$ = this.store.hasError$;
  //sendMessageTemplateList$ = this.store.sendMessageTemplateList$;
  sendMessageTemplateListDataSource = new MatTableDataSource<SendMessageTemplateDTO>();
  //sendMessageListLoaded$ = this.store.sendMessageTemplateList$.pipe(take(1));

  // sendMessageTemplateListDto!: SendMessageTemplateListDTO;
  // templateList : SendMessageTemplateDTO[] | undefined;
  displayedColumns: string[] = ['name', 'description','format','domain','rsmName'];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: DhTestClientDataAccessApiStore
    //private changeDetectorRefs: ChangeDetectorRef
  ) {



  }

  ngOnInit(): void {

    this.store.sendMessageTemplateList$.subscribe(dto => {
    this.sendMessageTemplateListDataSource.data = dto.templateList;
    //this.store.getMessageMessageTemplateList();
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
  });

    this.store.getMessageMessageTemplateList();
  }

  getChosenTemplate(template : SendMessageTemplateDTO)
  {
    this.router.navigate([`../${template.id}`], { relativeTo: this.route });
  }

}
@NgModule({
  imports: [
    DhSendRawMessageSearchFormScam,
    MatTableModule,
    WattEmptyStateModule,
    TranslocoModule,
    PushModule,
    CommonModule,
  ],
  declarations: [DhSendRawMessageSearchComponent],
})
export class DhSendRawMessageSearchScam {}
