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

import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { StronglyTypedDialog, WATT_MODAL, WattModalService } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import {
  EoMeteringPoint,
  MeteringPointType,
  AibTechCode,
} from '@energinet-datahub/eo/metering-points/domain';
import { translations } from '@energinet-datahub/eo/translations';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [WATT_MODAL, WattButtonComponent, TranslocoPipe],
  template: `
    <watt-modal
      #modal
      [title]="translations.meteringPoints.onOffTooltipTitle | transloco"
      closeLabel="Close modal"
      size="small"
    >
      <p>{{ translations.meteringPoints.onOffTooltipMessage | transloco }}</p>
      <watt-modal-actions>
        <watt-button (click)="modal.close(false)">{{
          translations.meteringPoints.onOffTooltipClose | transloco
        }}</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
class GranularCertificateHelperComponent extends StronglyTypedDialog {
  protected translations = translations;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    WattBadgeComponent,
    WattSpinnerComponent,
    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    MatSlideToggleModule,
    TranslocoPipe,
    JsonPipe,
  ],
  providers: [WattModalService],
  standalone: true,
  selector: 'eo-metering-points-table',
  styles: [
    `
      :host {
        --mdc-switch-selected-track-color: var(--watt-color-primary);
        --mdc-switch-selected-hover-track-color: var(--watt-color-primary);
        --mdc-switch-selected-focus-track-color: var(--watt-color-primary);
      }

      watt-empty-state {
        padding: var(--watt-space-l);
      }

      watt-paginator {
        display: block;
        margin: 0 -24px -24px -24px;
      }
    `,
  ],
  template: `
    @if (columns) {
      <watt-table [loading]="loading" [columns]="columns" [dataSource]="dataSource">
        <!-- ADDRESS Column -->
        <ng-container *wattTableCell="columns.address; let meteringPoint">
          <ng-container *ngIf="meteringPoint.address?.address1">
            {{ meteringPoint.address.address1 + ',' }}
          </ng-container>
          <ng-container *ngIf="meteringPoint.address?.address2">
            {{ meteringPoint.address.address2 + ',' }}
          </ng-container>
          <ng-container *ngIf="meteringPoint.address?.locality">
            {{ meteringPoint.address.locality + ',' }}
          </ng-container>
          {{ meteringPoint?.address?.postalCode }}
          {{ meteringPoint?.address?.city }}
        </ng-container>

        <ng-container *wattTableCell="columns.unit; let meteringPoint">
          @switch (meteringPoint.type) {
            @case ('Consumption') {
              <watt-badge type="neutral">{{
                translations.meteringPoints.consumptionUnit | transloco
              }}</watt-badge>
            }
            @case ('Production') {
              <watt-badge type="neutral">{{
                translations.meteringPoints.productionUnit | transloco
              }}</watt-badge>
            }
          }
        </ng-container>

        <!-- GRANULAR CERTIFICATES Column -->
        <ng-container *wattTableCell="columns.gc; let meteringPoint">
          <div
            *ngIf="
              meteringPoint.type === 'Consumption' ||
              (meteringPoint.type === 'Production' &&
                (meteringPoint.technology.aibTechCode === techCodes.Wind ||
                  meteringPoint.technology.aibTechCode === techCodes.Solar))
            "
            style="display: flex; align-items: center;"
          >
            <mat-slide-toggle
              (change)="
                toggleContract.emit({
                  checked: $event.checked,
                  gsrn: meteringPoint.gsrn,
                  type: meteringPoint.type
                })
              "
              [disabled]="meteringPoint.loadingContract"
              [checked]="meteringPoint.contract && !meteringPoint.loadingContract"
            />
            <watt-spinner
              [diameter]="24"
              style="margin-left: var(--watt-space-m);"
              [style.opacity]="meteringPoint.loadingContract ? 1 : 0"
            />
          </div>
        </ng-container>
      </watt-table>

      <watt-empty-state
        *ngIf="loading === false && dataSource.data.length === 0 && !hasError"
        icon="custom-power"
        [title]="translations.meteringPoints.noData.title | transloco"
        [message]="translations.meteringPoints.noData.message | transloco"
      />

      <watt-empty-state
        *ngIf="loading === false && hasError"
        icon="custom-power"
        [title]="translations.meteringPoints.error.title | transloco"
        [message]="translations.meteringPoints.error.message | transloco"
      />

      <watt-paginator [for]="dataSource" />
    }
  `,
})
export class EoMeteringPointsTableComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  protected translations = translations;

  dataSource: WattTableDataSource<EoMeteringPoint> = new WattTableDataSource(undefined);
  columns!: WattTableColumnDef<EoMeteringPoint>;
  techCodes = AibTechCode;

  @Input() set meteringPoints(data: EoMeteringPoint[] | null) {
    this.dataSource.data = data || [];
  }
  @Input() loading = false;
  @Input() hasError = false;
  @Output() toggleContract = new EventEmitter<{
    checked: boolean;
    gsrn: string;
    type: MeteringPointType;
  }>();

  private modalService = inject(WattModalService);

  ngOnInit(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setColumns();
      });
  }

  private setColumns(): void {
    this.columns = {
      gsrn: {
        accessor: 'gsrn',
        header: this.transloco.translate(this.translations.meteringPoints.gsrnTableHeader),
      },
      address: {
        accessor: (meteringPoint) => meteringPoint.address.address1,
        header: this.transloco.translate(this.translations.meteringPoints.addressTableHeader),
      },
      unit: {
        accessor: (meteringPoint) => meteringPoint.type,
        header: this.transloco.translate(this.translations.meteringPoints.unitTableHeader),
      },
      source: {
        accessor: (meteringPoint) => {
          if (meteringPoint.type !== 'Production') return '';

          switch (meteringPoint.technology.aibTechCode) {
            case AibTechCode.Solar:
              return this.transloco.translate(this.translations.meteringPoints.solarSource);
            case AibTechCode.Wind:
              return this.transloco.translate(this.translations.meteringPoints.windSource);
            case AibTechCode.Other:
              return this.transloco.translate(this.translations.meteringPoints.otherSource);
            default:
              return '';
          }
        },
        header: this.transloco.translate(this.translations.meteringPoints.sourceTableHeader),
      },
      gc: {
        accessor: (meteringPoint) => {
          const itemHasActiveContract = meteringPoint.contract ? 'active' : 'enable';
          return meteringPoint.type === 'Production' ? itemHasActiveContract : '';
        },
        header: this.transloco.translate(this.translations.meteringPoints.onOffTableHeader),
        align: 'center',
        helperAction: () => this.onToggleGranularCertificatesHelperText(),
      },
    };

    this.cd.detectChanges();
  }

  onToggleGranularCertificatesHelperText() {
    this.modalService.open({
      component: GranularCertificateHelperComponent,
    });
  }
}
