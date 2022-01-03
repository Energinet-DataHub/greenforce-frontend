import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { WattEmptyStateModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'dh-charges-server-error',
  templateUrl: './dh-charges-server-error.component.html',
  styleUrls: ['./dh-charges-server-error.component.scss']
})
export class DhChargesServerErrorComponent { }

@NgModule({
  imports: [
    TranslocoModule,
    CommonModule,
    WattEmptyStateModule
  ],
  declarations: [DhChargesServerErrorComponent],
  exports: [DhChargesServerErrorComponent],
})
export class DhChargesServerErrorScam {}
