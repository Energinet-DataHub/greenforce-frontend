//#region License
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
//#endregion
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Injectable,
  Input,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { fromUnixTime } from 'date-fns';

import { WattDataIntlService, WattDataTableComponent } from '@energinet-datahub/watt/data';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { translations } from '@energinet-datahub/ett/translations';
import { EttConsent, EttConsentService } from '@energinet-datahub/ett/consent/data-access-api';
import { EttGrantConsentModalComponent } from '@energinet-datahub/ett/consent/feature-grant-consent';
import { EttRequestConsentModalComponent } from '@energinet-datahub/ett/consent/feature-request-consent';
import { EttConsentDetailsDrawerComponent } from '@energinet-datahub/ett/consent/feature-details';

@Injectable()
export class EttDataIntlService extends WattDataIntlService {
  private readonly transloco = inject(TranslocoService);
  constructor() {
    super();

    this.transloco.selectTranslateObject('consent').subscribe((translations) => {
      this.search = translations.search;
      this.emptyTitle = translations.noData.message;
      this.emptyText = '';
      this.emptyRetry = translations.requestForConsent;
      this.errorTitle = translations.error.title;
      this.errorText = translations.error.message;
      this.changes.next();
    });
  }
}

const selector = 'ett-consent-overview';

@Component({
  selector,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WattDataTableComponent,
    WattTableComponent,
    TranslocoPipe,
    EttGrantConsentModalComponent,
    EttRequestConsentModalComponent,
    EttConsentDetailsDrawerComponent,
    WattButtonComponent,
  ],
  providers: [WattDatePipe, { provide: WattDataIntlService, useClass: EttDataIntlService }],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ${selector} .watt-data-table--empty-state {
        margin-bottom: var(--watt-space-xl);
      }
    `,
  ],
  template: `
    @if (columns) {
      <watt-data-table
        vater
        inset="m"
        [error]="state().hasError"
        [enableSearch]="false"
        [enableRetry]="true"
        [autoSize]="true"
        (retry)="requestPOA()"
      >
        <h3>{{ translations.consent.tableTitle | transloco }}</h3>
        <watt-button variant="secondary" (click)="requestPOA()">{{
          translations.consent.requestForConsent | transloco
        }}</watt-button>

        <watt-table
          [dataSource]="dataSource"
          [columns]="columns"
          sortBy="timestamp"
          sortDirection="desc"
          [loading]="state().isLoading"
          (rowClick)="selectConsent($event)"
        />
      </watt-data-table>
    }

    <ett-grant-consent-modal
      (closed)="onCloseGrantConsentDialog()"
      [thirdPartyClientId]="thirdPartyClientId"
      [organizationId]="organizationId"
      [redirectUrl]="redirectUrl"
    />
    <ett-request-consent-modal />

    @if (selectedConsent) {
      <ett-consent-details-drawer
        [consent]="selectedConsent"
        (consentDeleted)="removeConsent($event)"
      />
    }
  `,
})
export class EttConsentOverviewComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('third-party-client-id') thirdPartyClientId!: string;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('organization-id') organizationId!: string;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('redirect-url') redirectUrl!: string;

  private consentService: EttConsentService = inject(EttConsentService);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  @ViewChild(EttGrantConsentModalComponent, { static: true })
  grantConsentModal!: EttGrantConsentModalComponent;

  @ViewChild(EttRequestConsentModalComponent, { static: true })
  requestConsentModal!: EttRequestConsentModalComponent;

  @ViewChild(EttConsentDetailsDrawerComponent)
  consentDetailsModal!: EttConsentDetailsDrawerComponent;

  protected wattDatePipe: WattDatePipe = inject(WattDatePipe);
  protected translations = translations;
  protected dataSource: WattTableDataSource<EttConsent> = new WattTableDataSource(undefined);
  protected columns!: WattTableColumnDef<EttConsent>;
  protected state = signal<{ hasError: boolean; isLoading: boolean }>({
    hasError: false,
    isLoading: false,
  });
  protected selectedConsent: EttConsent | null = null;

  requestPOA(): void {
    this.requestConsentModal.open();
  }

  selectConsent(consent: EttConsent): void {
    this.selectedConsent = consent;
    this.cd.detectChanges();
    this.consentDetailsModal.open();
  }

  removeConsent(consent: EttConsent): void {
    this.selectedConsent = null;
    this.dataSource = new WattTableDataSource(
      this.dataSource.data.filter((x) => x.consentId !== consent.consentId)
    );
  }

  ngOnInit(): void {
    this.loadConsents();

    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setColumns();
        this.cd.detectChanges();

        if ((this.thirdPartyClientId || this.organizationId) && !this.grantConsentModal.opened) {
          this.grantConsentModal.open();
        }
      });
  }

  onCloseGrantConsentDialog(): void {
    this.router.navigate([], { queryParams: {} });
    this.loadConsents();
  }

  loadConsents(): void {
    this.state.set({ ...this.state(), isLoading: true });

    this.consentService.getConsents().subscribe({
      next: (consents: EttConsent[]) => {
        this.dataSource = new WattTableDataSource(consents);
        this.state.set({ ...this.state(), isLoading: false, hasError: false });
        this.cd.detectChanges();
      },
      error: () => {
        this.state.set({ ...this.state(), isLoading: false, hasError: true });
        this.cd.detectChanges();
      },
    });
  }

  private setColumns(): void {
    this.columns = {
      grantor: {
        accessor: (x) => x.giverOrganizationName,
        header: this.transloco.translate(this.translations.consent.grantorTableHeader),
      },
      agent: {
        accessor: (x) => x.receiverOrganizationName,
        header: this.transloco.translate(this.translations.consent.agentTableHeader),
      },
      validFrom: {
        accessor: (x) => this.wattDatePipe.transform(fromUnixTime(x.consentDate), 'short') ?? '',
        header: this.transloco.translate(this.translations.consent.validFromTableHeader),
      },
    };
  }
}
