import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-charge-actions',
  imports: [MatMenuModule, TranslocoDirective, WattButtonComponent, WattIconComponent],
  template: `
    <ng-container *transloco="let t; prefix: 'charges.charge.actions'">
      <watt-button variant="secondary" [matMenuTriggerFor]="menu">
        {{ t('actionsButton') }}
        <watt-icon name="plus" />
      </watt-button>
      <mat-menu #menu="matMenu"> </mat-menu>
    </ng-container>
  `,
})
export class DhChargeActionsComponent {}
