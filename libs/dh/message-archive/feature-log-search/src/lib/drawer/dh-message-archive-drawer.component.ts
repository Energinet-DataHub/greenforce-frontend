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
import { NgClass, DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { MatDividerModule } from '@angular/material/divider';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ArchivedMessage } from '@energinet-datahub/dh/shared/domain';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattDrawerComponent, WATT_DRAWER, WattDrawerSize } from '@energinet-datahub/watt/drawer';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { DhMessageArchiveDocumentStore } from '@energinet-datahub/dh/message-archive/data-access-api';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattBreakpoint, WattBreakpointsObserver } from '@energinet-datahub/watt/core/breakpoints';
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
    NgClass,
    TranslocoDirective,
    TranslocoPipe,
    MatDividerModule,
    RxPush,
    RxLet,

    WATT_DRAWER,
    WattIconComponent,
    WattDatePipe,
    WattButtonComponent,
    WattSpinnerComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattCodeComponent,

    DhMessageArchiveStatusComponent,
    ActorNamePipe,
    DocumentTypeNamePipe,
    DhEmDashFallbackPipe,
  ],
  providers: [provideComponentStore(DhMessageArchiveDocumentStore)],
})
export class DhMessageArchiveDrawerComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _document = inject(DOCUMENT);
  private _transloco = inject(TranslocoService);
  private _toastService = inject(WattToastService);
  private _apiStore = inject(DhMessageArchiveDocumentStore);
  private _breakpointsObserver = inject(WattBreakpointsObserver);

  @ViewChild('drawer') drawer!: WattDrawerComponent;
  drawerSize: WattDrawerSize = 'normal';

  @Input() actors: WattDropdownOptions | null = null;

  @Output() closed = new EventEmitter<void>();

  message: ArchivedMessage | null = null;
  documentContent = signal<string | null>(null);

  isLoading$ = this._apiStore.isLoading$;

  ngOnInit(): void {
    this.setDrawerSize();
  }

  open(message: ArchivedMessage) {
    this.message = null;
    this.message = message;
    this.documentContent.set(null);

    this.drawer.open();

    if (this.message) {
      this.getDocument(this.message.id);
    }
  }

  onClose() {
    this.drawer.close();
    this.closed.emit();
    this.message = null;
  }

  getDocument(id: string) {
    this._apiStore.getDocument({
      id,
      onSuccessFn: this.onSuccesFn,
      onErrorFn: this.onErrorFn,
    });
  }

  downloadDocument() {
    const blobPart = this.documentContent() as unknown as BlobPart;
    const blob = new Blob([blobPart]);
    const url = window.URL.createObjectURL(blob);
    const link = this._document.createElement('a');
    link.href = url;
    link.download = `${this.message?.messageId}.txt`;
    link.click();
    link.remove();
  }

  private readonly onSuccesFn = async (id: string, data: string) => {
    this.documentContent.set(data);
  };

  private readonly onErrorFn = () => {
    const errorText = this._transloco.translate('messageArchive.document.loadFailed');
    this._toastService.open({ message: errorText, type: 'danger' });
  };

  private setDrawerSize(): void {
    this._breakpointsObserver
      .observe([WattBreakpoint.XLarge])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((result) => {
        this.drawerSize = result.matches ? 'large' : 'normal';
      });
  }
}
