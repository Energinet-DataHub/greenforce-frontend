import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  NgModule,
  Output,
} from '@angular/core';
import {
  WattButtonModule,
  WattEmptyStateModule,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-server-error',
  templateUrl: './dh-metering-point-server-error.component.html',
})
export class DhMeteringPointServerErrorComponent {
  @Output() reload = new EventEmitter<void>();
}

@NgModule({
  declarations: [DhMeteringPointServerErrorComponent],
  exports: [DhMeteringPointServerErrorComponent],
  imports: [TranslocoModule, WattButtonModule, WattEmptyStateModule],
})
export class DhMeteringPointServerErrorScam {}
