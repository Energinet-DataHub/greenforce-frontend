import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { WattEmptyStateModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'dh-charges-not-found',
  templateUrl: './dh-charges-not-found.component.html',
  styleUrls: ['./dh-charges-not-found.component.scss']
})
export class DhChargesNotFoundComponent {}

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    WattEmptyStateModule
  ],
  declarations: [DhChargesNotFoundComponent],
  exports: [DhChargesNotFoundComponent],
})
export class DhChargesNotFoundScam {}

