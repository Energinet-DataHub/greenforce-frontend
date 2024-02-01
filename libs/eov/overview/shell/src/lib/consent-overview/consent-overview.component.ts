import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
} from '@energinet-datahub/watt/expandable-card';
import { EovOverviewService } from '@energinet-datahub/eov/overview/data-access-api';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { filter, map, take } from 'rxjs';
import { ApplicationEnum, ConsentDto } from '@energinet-datahub/eov/shared/domain';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'eov-consent-overview',
  standalone: true,
  imports: [CommonModule, WattExpandableCardComponent, WattExpandableCardTitleComponent, TranslocoPipe, WattButtonComponent],
  templateUrl: './consent-overview.component.html',
  styleUrl: './consent-overview.component.scss'
})
export class ConsentOverviewComponent {
  service = inject(EovOverviewService);
  translocoService = inject(TranslocoService);
  availableConsents = [ApplicationEnum.Value0, ApplicationEnum.Value4];
  consents$ = this.service.getConsents(this.translocoService.getActiveLang());
  availableConsents$ = this.consents$.pipe(map((givenConsents) => this.availableConsents.map((id) => givenConsents?.find((givenConsent) => givenConsent.applicationId === id) ? undefined : { applicationId: id }).filter((v) => !!v)));

  getApplicationName(applicationId: ApplicationEnum) {
    switch (applicationId) {
      case ApplicationEnum.Value0:
        return 'CustomerApp';
      case ApplicationEnum.Value4:
        return 'CustomerApi';
    }
    return '';
  }

  deleteConsent(applicationId: ApplicationEnum) {
    this.service.deleteConsent(applicationId).pipe(take(1)).subscribe();
  }
}
