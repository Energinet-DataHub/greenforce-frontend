import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { WattNavListModule } from '@energinet-datahub/watt';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-primary-navigation',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  templateUrl: './dh-primary-navigation.component.html',
})
export class DhPrimaryNavigationComponent {}

@NgModule({
  declarations: [DhPrimaryNavigationComponent],
  exports: [DhPrimaryNavigationComponent],
  imports: [TranslocoModule, RouterModule, WattNavListModule],
})
export class DhPrimaryNavigationScam {}
