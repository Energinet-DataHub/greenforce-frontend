import { Component, input } from '@angular/core';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import { RelatedMeteringPoints } from './types';
import { combineWithIdPaths, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dh-related-metering-points',
  imports: [WattCardComponent, RouterLink],
  template: `
    <watt-card>
      <ul>
        @let parent = relatedMeteringPoints()?.parent;

        @if (parent) {
          <li [routerLink]="getLink('master-data', parent.identification)">
            {{ parent.identification }}
          </li>
        }
        @for (
          meteringPoint of relatedMeteringPoints()?.relatedMeteringPoints;
          track meteringPoint.identification
        ) {
          <li [routerLink]="getLink('master-data', meteringPoint.identification)">
            {{ meteringPoint.identification }}
          </li>
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.relatedByGsrn;
          track meteringPoint.identification
        ) {
          <li [routerLink]="getLink('master-data', meteringPoint.identification)">
            {{ meteringPoint.identification }}
          </li>
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.historicalMeteringPoints;
          track meteringPoint.identification
        ) {
          <li [routerLink]="getLink('master-data', meteringPoint.identification)">
            {{ meteringPoint.identification }}
          </li>
        }

        @for (
          meteringPoint of relatedMeteringPoints()?.historicalMeteringPointsByGsrn;
          track meteringPoint.identification
        ) {
          <li [routerLink]="getLink('master-data', meteringPoint.identification)">
            {{ meteringPoint.identification }}
          </li>
        }
      </ul>
    </watt-card>
  `,
})
export class DhRelatedMeteringPointsComponent {
  relatedMeteringPoints = input<RelatedMeteringPoints>();
  getLink = (path: MeteringPointSubPaths, id: string) =>
    combineWithIdPaths('metering-point', id, path);
}
