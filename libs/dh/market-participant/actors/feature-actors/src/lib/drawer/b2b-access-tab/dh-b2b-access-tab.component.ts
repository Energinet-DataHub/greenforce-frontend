import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DhMarketParticipantCertificateStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhCertificateComponent } from './dh-certificate.component';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { TranslocoDirective } from '@ngneat/transloco';
import { DhCertificateUploaderComponent } from './dh-certificate-uploader.component';

@Component({
  selector: 'dh-b2b-access-tab',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <vater-flex direction="row" justify="center" *ngIf="loadingCredentials(); else elseCase">
      <watt-spinner />
    </vater-flex>

    <ng-template #elseCase>
      <ng-container *ngIf="doCredentialsExist(); else emptyState">
        <ng-container *ngIf="doesCertificateExist()">
          <dh-certificate [actorId]="actorId" />
        </ng-container>

        <!-- If client secret exists -->
        <!-- Show client secret component -->
        <!-- Else show empty state -->
      </ng-container>

      <ng-template #emptyState>
        <vater-stack direction="row" justify="center">
          <dh-certificate-uploader [actorId]="actorId" />
        </vater-stack>
      </ng-template>
    </ng-template>
  `,
  viewProviders: [DhMarketParticipantCertificateStore],
  imports: [
    NgIf,
    TranslocoDirective,
    VaterStackComponent,
    VaterFlexComponent,
    WattButtonComponent,
    WattSpinnerComponent,

    DhCertificateComponent,
    DhCertificateUploaderComponent,
  ],
})
export class DhB2bAccessTabComponent implements OnChanges {
  private readonly store = inject(DhMarketParticipantCertificateStore);

  doCredentialsExist = toSignal(this.store.doCredentialsExist$);
  doesCertificateExist = toSignal(this.store.doesCertificateExist$);

  loadingCredentials = toSignal(this.store.loadingCredentials$);

  @Input({ required: true }) actorId = '';

  ngOnChanges(): void {
    this.store.getCredentials(this.actorId);
  }
}
