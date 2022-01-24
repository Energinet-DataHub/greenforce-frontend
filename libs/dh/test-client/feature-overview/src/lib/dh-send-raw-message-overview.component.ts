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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { LetModule,PushModule } from '@rx-angular/template';
import { TranslocoModule } from '@ngneat/transloco';

import { DhTestClientDataAccessApiStore } from '@energinet-datahub/dh/test-client/data-access-api';
import { WattSpinnerModule, WattTabsModule } from '@energinet-datahub/watt';

//import { DhSecondaryMasterDataComponentScam } from './secondary-master-data/dh-secondary-master-data.component';
//import { DhBreadcrumbScam } from './breadcrumb/dh-breadcrumb.component';
// import { DhMeteringPointIdentityScam } from './identity/dh-test-client-identity.component';
import { dhSendRawMessageTemplateIdParam } from './routing/dh-send-raw-message-id-param';
// import { DhMeteringPointNotFoundScam } from './not-found/dh-test-client-not-found.component';
// import { DhMeteringPointPrimaryMasterDataScam } from './primary-master-data/dh-test-client-primary-master-data.component';
// import { DhMeteringPointServerErrorScam } from './server-error/dh-test-client-server-error.component';
// import { DhChargesScam } from './charges/dh-charges.component';
// import { DhChildMeteringPointTabContentScam } from './child-test-client-tab-content/dh-child-test-client-tab-content.component';
// import { DhIsParentPipeScam } from './shared/is-parent.pipe';

import { DhSendRawMessageOverviewFormScam } from './form/dh-send-raw-message-overview-form.component';
import { DhSendRawMessageTempPropsScam } from './templateProperties/dh-send-raw-message-temp-props.component';
import { SendMessageTemplateDTO, SendMessageResultDTO } from '@energinet-datahub/dh/shared/data-access-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-send-raw-message-overview',
  styleUrls: ['./dh-send-raw-message-overview.component.scss'],
  templateUrl: './dh-send-raw-message-overview.component.html',
  providers: [DhTestClientDataAccessApiStore],
})
export class DhSendRawMessageOverviewComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  sendMessageTemplateId$ = this.route.params.pipe(
    map((params) => params[dhSendRawMessageTemplateIdParam] as string)
  );
  //Investigate further
  sendMessageTemplate$ = this.store.sendMessageTemplate$;
  sendMessageResult$ = this.store.sendMessageResult$;
  //.pipe(
    // tap((meteringPoint) => {
    //   this.childMeteringPointsCount =
    //     meteringPoint.childMeteringPoints?.length ?? 0;
    // })
  //);
  isLoading$ = this.store.isLoading$;
  sendMessageTemplateNotFound$ = this.store.sendMessageNotFound$;
  hasError$ = this.store.hasError$;
  childMeteringPointsCount = 0;

  constructor(
    private route: ActivatedRoute,
    private store: DhTestClientDataAccessApiStore
  ) {
    this.getSendMessageTemplate();
    this.getSendMessageResult();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onSubmit(sendMessageTemplateDto: SendMessageTemplateDTO) {
    console.warn('test submit overview:');
    console.warn(sendMessageTemplateDto);

    this.store.getSendMessage(sendMessageTemplateDto);

    //const sendMesResult =
    //this.store.sendMessageSimple(sendMessageTemplateDto);


    //console.error(sendMesResult);

  }

  getSendMessageTemplate(): void {
    this.sendMessageTemplateId$
      .pipe(
        takeUntil(this.destroy$),
        map((sendMessageTemplateId) =>
          this.store.getSendMessageTemplate(sendMessageTemplateId)
        )
      )
      .subscribe();
  }

  getSendMessageResult(): void {

    this.sendMessageResult$.pipe(
      takeUntil(this.destroy$),
      map((sendMessageResult) =>
      {
        console.error('xxxx2');
        console.error(sendMessageResult);
      }
      )
    ).subscribe();

          // this.store.getSendMessage(sendMessageTemplateDto).pipe(
          //   takeUntil(this.destroy$),
          //   map((sendMessageResult) =>
          //     console.warn(sendMessageResult)
          //   )
          // ).subscribe();

  }
}

@NgModule({
  declarations: [DhSendRawMessageOverviewComponent],
  imports: [
    CommonModule,
    DhSendRawMessageOverviewFormScam,
    DhSendRawMessageTempPropsScam,
    //DhBreadcrumbScam,
    // DhMeteringPointIdentityScam,
    // DhMeteringPointNotFoundScam,
    // DhMeteringPointPrimaryMasterDataScam,
    // DhMeteringPointServerErrorScam,
    LetModule,
    WattSpinnerModule,
    // DhSecondaryMasterDataComponentScam,
    // DhChargesScam,
    WattTabsModule,
 //   DhChildMeteringPointTabContentScam,
 PushModule,
    TranslocoModule,
 //   DhIsParentPipeScam,
  ],
})
export class DhSendRawMessageOverviewScam {}
