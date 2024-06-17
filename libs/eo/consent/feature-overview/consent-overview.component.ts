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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { translations } from '@energinet-datahub/eo/translations';
import { EoGrantConsentModalComponent } from '@energinet-datahub/eo/consent/feature-grant-consent';
import { Router } from '@angular/router';

const selector = 'eo-consent-overview';

@Component({
  selector,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattDataTableComponent,
    VaterStackComponent,
    WattTableComponent,
    TranslocoPipe,
    EoGrantConsentModalComponent,
  ],
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
      <watt-data-table vater inset="m" [error]="state().hasError">
        <h3>{{ translations.consent.tableTitle | transloco }}</h3>

        <watt-table
          [dataSource]="dataSource"
          [columns]="columns"
          sortBy="timestamp"
          sortDirection="desc"
          [loading]="state().isLoading"
        />
      </watt-data-table>
    }

    <eo-grant-consent-modal
      (declined)="onDeclineConsent()"
      [thirdPartyClientId]="thirdPartyClientId"
    />
  `,
})
export class EoConsentOverviewComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('third-party-client-id') thirdPartyClientId!: string;

  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  @ViewChild(EoGrantConsentModalComponent, { static: true })
  grantConsentModal!: EoGrantConsentModalComponent;

  protected translations = translations;
  // TODO: Backend is not ready yet, so we don't have any data to show or have it will be mocked
  protected dataSource: WattTableDataSource<unknown> = new WattTableDataSource(undefined);
  protected columns!: WattTableColumnDef<unknown>;
  protected state = signal<{ hasError: boolean; isLoading: boolean }>({
    hasError: false,
    isLoading: false,
  });

  ngOnInit(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setColumns();
        this.cd.detectChanges();

        if (this.thirdPartyClientId) {
          this.grantConsentModal.open();
        }
      });
  }

  onDeclineConsent(): void {
    this.router.navigate([], { queryParams: {} });
  }

  private setColumns(): void {
    this.columns = {
      grantor: {
        accessor: (x) => x,
        header: this.transloco.translate(this.translations.consent.grantorTableHeader),
      },
      agent: {
        accessor: (x) => x,
        header: this.transloco.translate(this.translations.consent.agentTableHeader),
      },
      validFrom: {
        accessor: (x) => x,
        header: this.transloco.translate(this.translations.consent.validFromTableHeader),
      },
    };
  }
}
