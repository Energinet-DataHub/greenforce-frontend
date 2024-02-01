import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import {
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
} from '@energinet-datahub/watt/expandable-card';
import { EovOverviewService } from '@energinet-datahub/eov/overview/data-access-api';
import { TranslocoPipe } from '@ngneat/transloco';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';

@Component({
  selector: 'eov-authorizations-overview',
  standalone: true,
  imports: [NgFor, WattExpandableCardComponent, WattExpandableCardTitleComponent, TranslocoPipe, WattIconComponent, AsyncPipe, WattTooltipDirective, DatePipe, NgIf],
  templateUrl: './authorizations-overview.component.html',
  styleUrl: './authorizations-overview.component.scss'
})
export class AuthorizationsOverviewComponent {
  service = inject(EovOverviewService);
  authorizations$ = this.service.getAuthorizations();

  downloadDocument(authorizationId: string): void {
    this.service.getAuthorizationPrint(authorizationId);
  }
}
