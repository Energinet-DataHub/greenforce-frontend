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
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { MatDividerModule } from '@angular/material/divider';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { ArchivedMessage, Stream } from '@energinet-datahub/dh/shared/domain';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattDrawerComponent, WATT_DRAWER, WattDrawerSize } from '@energinet-datahub/watt/drawer';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { DhMessageArchiveDocumentStore } from '@energinet-datahub/dh/message-archive/data-access-api';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattBreakpoint, WattBreakpointsObserver } from '@energinet-datahub/watt/breakpoints';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhMessageArchiveStatusComponent } from '../shared/dh-message-archive-status.component';
import { ActorNamePipe } from '../shared/dh-message-archive-actor.pipe';
import { DocumentTypeNamePipe } from '../shared/dh-message-archive-documentTypeName.pipe';

@Component({
  standalone: true,
  selector: 'dh-message-archive-drawer',
  templateUrl: './dh-message-archive-drawer.component.html',
  styleUrls: ['./dh-message-archive-drawer.component.scss'],
  imports: [
    CommonModule,
    WATT_DRAWER,
    TranslocoModule,
    WattIconComponent,
    WattDatePipe,
    DhMessageArchiveStatusComponent,
    MatDividerModule,
    ActorNamePipe,
    DocumentTypeNamePipe,
    WattButtonComponent,
    PushModule,
    DhEmDashFallbackPipe,
    WattSpinnerComponent,
    LetModule,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattCodeComponent,
  ],
  providers: [provideComponentStore(DhMessageArchiveDocumentStore)],
})
export class DhMessageArchiveDrawerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private document = inject(DOCUMENT);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private apiStore = inject(DhMessageArchiveDocumentStore);
  private breakpointsObserver = inject(WattBreakpointsObserver);

  @ViewChild('drawer') drawer!: WattDrawerComponent;
  drawerSize: WattDrawerSize = 'normal';

  @Input() actors: WattDropdownOptions | null = null;

  message: ArchivedMessage | null = null;
  documentContent: string | null = null;

  isLoading$ = this.apiStore.isLoading$;

  ngOnInit(): void {
    this.setDrawerSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open(message: ArchivedMessage) {
    this.message = null;
    this.message = message;
    this.drawer.open();

    if (this.message) {
      this.getDocument(this.message?.messageId);
    }
  }

  onClose() {
    this.drawer.close();
    this.message = null;
  }

  getDocument(messageId: string) {
    this.apiStore.getDocument({
      id: messageId,
      onSuccessFn: this.onSuccesFn,
      onErrorFn: this.onErrorFn,
    });
  }

  downloadDocument() {
    const blobPart = this.documentContent as unknown as BlobPart;
    const blob = new Blob([blobPart]);
    const url = window.URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = `${this.message?.messageId}.txt`;
    link.click();
    link.remove();
  }

  private readonly onSuccesFn = async (id: string, data: Stream) => {
    const blobPart = data as unknown as BlobPart;
    const blob = new Blob([blobPart]);
    this.documentContent = await new Response(blob).text();
  };

  private readonly onErrorFn = () => {
    const errorText = this.transloco.translate('messageArchive.document.loadFailed');
    this.toastService.open({ message: errorText, type: 'danger' });
  };

  private setDrawerSize(): void {
    this.breakpointsObserver
      .observe([WattBreakpoint.XLarge])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.drawerSize = result.matches ? 'large' : 'normal';
      });
  }
}
