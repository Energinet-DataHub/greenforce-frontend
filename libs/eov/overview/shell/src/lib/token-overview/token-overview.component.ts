import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EovOverviewService } from '@energinet-datahub/eov/overview/data-access-api';
import { TranslocoPipe } from '@ngneat/transloco';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
} from '@energinet-datahub/watt/expandable-card';
import { TokenRegistrationDto } from '@energinet-datahub/eov/shared/domain';
import { map, take } from 'rxjs';
import { WattIcon } from '@energinet-datahub/watt/icon';

@Component({
  selector: 'eov-token-overview',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, WattButtonComponent, WattExpandableCardComponent, WattExpandableCardTitleComponent],
  templateUrl: './token-overview.component.html',
  styleUrl: './token-overview.component.scss'
})
export class TokenOverviewComponent {
  service = inject(EovOverviewService);
  tokens$ = this.service.getTokens().pipe(map((result) => result.result ?? []));

  deleteToken(token: TokenRegistrationDto) {
    this.service.deleteToken(token).pipe(take(1)).subscribe(() => {
      this.tokens$ = this.service.getTokens().pipe(map((result) => result.result ?? []));
    });
  }

  getIcon(token: TokenRegistrationDto): WattIcon {
    return !!token.deactivatedDate ? 'checkmark' : 'close';
  }

  deactivateToken(token: TokenRegistrationDto) {
    if (!!token.deactivatedDate) {
      this.service.activateToken(token).pipe(take(1)).subscribe(() => {
        this.tokens$ = this.service.getTokens().pipe(map((result) => result.result ?? []));
      });
    } else {
      this.service.deactivateToken(token).pipe(take(1)).subscribe(() => {
        this.tokens$ = this.service.getTokens().pipe(map((result) => result.result ?? []));
      });
    }
  }
}
