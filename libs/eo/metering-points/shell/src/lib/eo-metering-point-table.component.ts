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
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
  WATT_TABLE,
  WattTableDataSource,
  WattTableColumnDef,
  WattTableComponent,
  WattPaginatorComponent,
} from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { EoMeteringPoint, AibTechCode } from '@energinet-datahub/eo/metering-points/domain';
import { translations } from '@energinet-datahub/eo/translations';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    WattBadgeComponent,
    WattSpinnerComponent,
    WATT_TABLE,
    WattPaginatorComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    MatSlideToggleModule,
    TranslocoPipe,
    JsonPipe,
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-metering-points-table',
  styles: [
    `
      eo-metering-points-table {
        --mdc-switch-selected-track-color: var(--watt-color-primary);
        --mdc-switch-selected-hover-track-color: var(--watt-color-primary);
        --mdc-switch-selected-focus-track-color: var(--watt-color-primary);

        watt-empty-state {
          padding: var(--watt-space-l);
        }

        watt-table
          .mat-mdc-table:not(.watt-table-has-selection)
          tr.mdc-data-table__row:last-child
          .mat-mdc-cell {
          border-bottom: none;
        }

        watt-paginator {
          display: block;
          margin: 1px -24px -24px -24px;
        }
      }
    `,
  ],
  template: `
    @if (columns) {
      <watt-table
        #table
        [selectable]="true"
        [loading]="loading"
        [columns]="columns"
        [dataSource]="dataSource"
        (selectionChange)="onSelection($event)"
      >
        <!-- UNIT Column -->
        <ng-container *wattTableCell="columns.unit; let meteringPoint">
          @switch (meteringPoint.type) {
            @case ('Consumption') {
              {{ translations.meteringPoints.consumptionUnit | transloco }}
            }
            @case ('Production') {
              {{ translations.meteringPoints.productionUnit | transloco }}
            }
          }
        </ng-container>

        <ng-container *wattTableCell="columns.status; let meteringPoint">
          @if (meteringPoint.contract) {
            <watt-badge type="success">{{
              translations.meteringPoints.active | transloco
            }}</watt-badge>
          } @else {
            <watt-badge type="neutral">{{
              translations.meteringPoints.inactive | transloco
            }}</watt-badge>
          }
        </ng-container>

        <ng-container *wattTableToolbar="let selection">
          {{ translations.meteringPoints.selected | transloco: { amount: selection.length } }}
          <watt-table-toolbar-spacer />

          <watt-button
            variant="primary"
            icon="toggleOff"
            [disabled]="!canDeactivate()"
            (click)="onDeactivateContracts(selection)"
            [loading]="deactivatingContracts"
          >
            {{ translations.meteringPoints.deactivate | transloco }}
          </watt-button>

          <watt-button
            variant="primary"
            icon="toggleOn"
            [disabled]="!canActivate()"
            (click)="onActivateContracts(selection)"
            [loading]="creatingContracts"
          >
            {{ translations.meteringPoints.activate | transloco }}
          </watt-button>
        </ng-container>
      </watt-table>

      <!-- Pending relation status -->
      @if (showPendingRelationStatus && loading === false && !hasError) {
        <watt-empty-state
          icon="pendingActions"
          [title]="translations.meteringPoints.pendingRelationStatus.title | transloco"
          [message]="translations.meteringPoints.pendingRelationStatus.message | transloco"
        />
      }

      <!-- No data -->
      @if (
        dataSource.data.length === 0 && loading === false && !hasError && !showPendingRelationStatus
      ) {
        <watt-empty-state
          icon="custom-power"
          [title]="translations.meteringPoints.noData.title | transloco"
          [message]="translations.meteringPoints.noData.message | transloco"
        />
      }

      <!-- Error -->
      @if (loading === false && hasError) {
        <watt-empty-state
          icon="custom-power"
          [title]="translations.meteringPoints.error.title | transloco"
          [message]="translations.meteringPoints.error.message | transloco"
        />
      }

      <watt-paginator [for]="dataSource" />
    }
  `,
})
export class EoMeteringPointsTableComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  protected translations = translations;
  protected canActivate = signal<boolean>(false);
  protected canDeactivate = signal<boolean>(false);
  protected dataSource: WattTableDataSource<EoMeteringPoint> = new WattTableDataSource(undefined);
  protected columns!: WattTableColumnDef<EoMeteringPoint>;
  protected techCodes = AibTechCode;

  @ViewChild('table') table!: WattTableComponent<EoMeteringPoint>;

  @Input() set meteringPoints(data: EoMeteringPoint[] | null) {
    this.dataSource.data =
      data?.map((meteringPoint: EoMeteringPoint, index) => {
        return {
          id: index,
          ...meteringPoint,
        };
      }) || [];

    this.table?.clearSelection();
  }
  @Input() loading = false;
  @Input() creatingContracts = false;
  @Input() deactivatingContracts = false;
  @Input() hasError = false;
  @Input() showPendingRelationStatus = false;
  @Output() activateContracts = new EventEmitter<EoMeteringPoint[]>();
  @Output() deactivateContracts = new EventEmitter<EoMeteringPoint[]>();

  ngOnInit(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setColumns();
      });
  }

  onSelection(selection: EoMeteringPoint[]): void {
    const toggableMeteringPoints = selection.filter((meteringPoint) =>
      this.isToggleable(meteringPoint)
    );

    this.canActivate.set(toggableMeteringPoints.some((meteringPoint) => !meteringPoint.contract));

    this.canDeactivate.set(toggableMeteringPoints.some((meteringPoint) => meteringPoint.contract));
  }

  onActivateContracts(selection: EoMeteringPoint[]): void {
    if (this.creatingContracts) return;
    const toggableMeteringPoints = selection.filter(
      (meteringPoint) => this.isToggleable(meteringPoint) && !meteringPoint.contract
    );
    if (toggableMeteringPoints.length === 0) return;

    this.activateContracts.emit(toggableMeteringPoints);
  }

  onDeactivateContracts(selection: EoMeteringPoint[]): void {
    if (this.deactivatingContracts) return;
    const toggableMeteringPoints = selection.filter(
      (meteringPoint) => this.isToggleable(meteringPoint) && meteringPoint.contract
    );
    if (toggableMeteringPoints.length === 0) return;

    this.deactivateContracts.emit(toggableMeteringPoints);
  }

  private isToggleable(meteringPoint: EoMeteringPoint): boolean {
    return (
      meteringPoint.type === 'Consumption' ||
      (meteringPoint.type === 'Production' &&
        (meteringPoint.technology.aibTechCode === this.techCodes.Wind ||
          meteringPoint.technology.aibTechCode === this.techCodes.Solar))
    );
  }

  private setColumns(): void {
    this.columns = {
      gsrn: {
        accessor: 'gsrn',
        header: this.transloco.translate(this.translations.meteringPoints.gsrnTableHeader),
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
      address: {
        accessor: (meteringPoint) => {
          let adress = meteringPoint.address.address1;
          if (meteringPoint.address.address2) {
            adress += ',' + meteringPoint.address.address2;
          }
          if (meteringPoint.address.locality) {
            adress += ',' + meteringPoint.address.locality;
          }
          return adress;
        },
        header: this.transloco.translate(this.translations.meteringPoints.addressTableHeader),
      },
      city: {
        accessor: (meteringPoint) =>
          `${meteringPoint.address.postalCode} ${meteringPoint.address.city}`,
        header: this.transloco.translate(this.translations.meteringPoints.cityTableHeader),
      },
      status: {
        header: this.transloco.translate(this.translations.meteringPoints.statusTableHeader),
        accessor: (meteringPoint) => {
          return meteringPoint.contract ? 'active' : 'inactive';
        },
      },
    };

    this.cd.detectChanges();
  }
}
