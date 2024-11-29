import { Component, computed } from '@angular/core';

import { DhGridAreasOverviewComponent } from '@energinet-datahub/dh/market-participant/grid-areas/overview';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetGridAreaOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhGridAreaRow } from '@energinet-datahub/dh/market-participant/grid-areas/domain';

@Component({
  selector: 'dh-grid-areas-shell',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <dh-grid-areas-overview
      [gridAreas]="rows()"
      [isLoading]="isLoading()"
      [hasError]="hasError()"
    />
  `,
  imports: [DhGridAreasOverviewComponent],
})
export class DhGridAreasShellComponent {
  private gln = new RegExp('^[0-9]+$');
  private getActorsQuery = query(GetGridAreaOverviewDocument);

  isLoading = this.getActorsQuery.loading;
  hasError = this.getActorsQuery.hasError;

  rows = computed<DhGridAreaRow[]>(() => {
    const gridAreas = this.getActorsQuery.data()?.gridAreaOverview ?? [];

    return gridAreas.map((x) => {
      const row: DhGridAreaRow = {
        id: x.id,
        code: x.code,
        actor: x.actorNumber
          ? `${x.actorName} • ${this.gln.test(x.actorNumber) ? 'GLN' : 'EIC'} ${x.actorNumber}`
          : '',
        organization: x.organizationName ?? '',
        status: x.status,
        type: x.type,
        priceArea: x.priceAreaCode,
        period: {
          start: x.validFrom,
          end: x.validTo ?? null,
        },
      };

      return row;
    });
  });
}
