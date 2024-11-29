import { Component, effect, input, output, viewChild } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhGridAreaRow } from '@energinet-datahub/dh/market-participant/grid-areas/domain';

import { DhGridAreaStatusBadgeComponent } from '../dh-grid-area-status-badge.component';

@Component({
  selector: 'dh-grid-area-details',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    VaterFlexComponent,
    WattDatePipe,
    WATT_DRAWER,
    DhGridAreaStatusBadgeComponent,
  ],
  template: `
    @let gridAreaView = gridArea();

    <watt-drawer
      #drawer
      (closed)="closed.emit()"
      *transloco="let t; read: 'marketParticipant.gridAreas'"
    >
      @if (gridAreaView) {
        <watt-drawer-topbar>
          <dh-gridarea-status-badge [status]="gridAreaView.status" />
        </watt-drawer-topbar>
      }

      @if (gridAreaView) {
        <watt-drawer-heading>
          <h2 class="watt-space-stack-s">{{ gridAreaView.code }}</h2>

          <vater-flex direction="row" justify="flex-start" wrap="wrap" gap="ml">
            <vater-flex direction="row" gap="s" grow="0">
              <span class="watt-label">{{ t('columns.actor') }}</span>
              <span>{{ gridAreaView.actor }}</span>
            </vater-flex>

            <vater-flex direction="row" gap="s" grow="0">
              <span class="watt-label">{{ t('columns.organization') }}</span>
              <span>{{ gridAreaView.organization }}</span>
            </vater-flex>

            <vater-flex direction="row" gap="s" grow="0">
              <span class="watt-label">{{ t('columns.priceArea') }}</span>
              <span>{{ gridAreaView.priceArea }}</span>
            </vater-flex>

            <vater-flex direction="row" gap="s" grow="0">
              <span class="watt-label">{{ t('columns.type') }}</span>
              <span>{{ t('types.' + gridAreaView.type) }}</span>
            </vater-flex>

            <vater-flex direction="row" gap="s" grow="0">
              <span class="watt-label">{{ t('columns.period') }}</span>
              <span>{{ gridAreaView.period | wattDate }}</span>
            </vater-flex>
          </vater-flex>
        </watt-drawer-heading>
      }
    </watt-drawer>
  `,
})
export class DhGridAreaDetailsComponent {
  private drawer = viewChild.required(WattDrawerComponent);

  gridArea = input<DhGridAreaRow>();

  closed = output();

  constructor() {
    effect(() => {
      if (this.gridArea()) {
        this.drawer().open();
      }
    });
  }
}
