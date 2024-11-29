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
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
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

import { translations } from '@energinet-datahub/eo/translations';
import { EoConsent, EoConsentService } from '@energinet-datahub/eo/consent/data-access-api';
import { EoGrantConsentModalComponent } from '@energinet-datahub/eo/consent/feature-grant-consent';
import { EoRequestConsentModalComponent } from '@energinet-datahub/eo/consent/feature-request-consent';
import { EoConsentDetailsDrawerComponent } from '@energinet-datahub/eo/consent/feature-details';

@Injectable()
export class EoDataIntlService extends WattDataIntlService {
  constructor(transloco: TranslocoService) {
    super();

    transloco.selectTranslateObject('consent').subscribe((translations) => {
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

const selector = 'eo-consent-overview';

@Component({
  selector,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattDataTableComponent,
    WattTableComponent,
    TranslocoPipe,
    EoGrantConsentModalComponent,
    EoRequestConsentModalComponent,
    EoConsentDetailsDrawerComponent,
    WattButtonComponent,
  ],
  providers: [WattDatePipe, { provide: WattDataIntlService, useClass: EoDataIntlService }],
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

    <eo-grant-consent-modal
      (closed)="onCloseGrantConsentDialog()"
      [thirdPartyClientId]="thirdPartyClientId"
      [organizationId]="organizationId"
      [redirectUrl]="redirectUrl"
    />
    <eo-request-consent-modal />

    @if (selectedConsent) {
      <eo-consent-details-drawer
        [consent]="selectedConsent"
        (consentDeleted)="removeConsent($event)"
      />
    }
  `,
})
export class EoConsentOverviewComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('third-party-client-id') thirdPartyClientId!: string;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('organization-id') organizationId!: string;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('redirect-url') redirectUrl!: string;

  private consentService: EoConsentService = inject(EoConsentService);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  @ViewChild(EoGrantConsentModalComponent, { static: true })
  grantConsentModal!: EoGrantConsentModalComponent;

  @ViewChild(EoRequestConsentModalComponent, { static: true })
  requestConsentModal!: EoRequestConsentModalComponent;

  @ViewChild(EoConsentDetailsDrawerComponent)
  consentDetailsModal!: EoConsentDetailsDrawerComponent;

  protected wattDatePipe: WattDatePipe = inject(WattDatePipe);
  protected translations = translations;
  protected dataSource: WattTableDataSource<EoConsent> = new WattTableDataSource(undefined);
  protected columns!: WattTableColumnDef<EoConsent>;
  protected state = signal<{ hasError: boolean; isLoading: boolean }>({
    hasError: false,
    isLoading: false,
  });
  protected selectedConsent: EoConsent | null = null;

  requestPOA(): void {
    this.requestConsentModal.open();
  }

  selectConsent(consent: EoConsent): void {
    this.selectedConsent = consent;
    this.cd.detectChanges();
    this.consentDetailsModal.open();
  }

  removeConsent(consent: EoConsent): void {
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
      next: (consents: EoConsent[]) => {
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
