import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';

import { DhMeteringPointStatusBadgeScam } from '../status-badge/dh-metering-point-status-badge.component';

export interface MeteringPointIdentityTranslationKeys {
  meteringMethod: string;
  meteringPointType: string;
  readingOccurrence: string;
  settlementMethod: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-identity',
  styleUrls: ['./dh-metering-point-identity.component.scss'],
  templateUrl: './dh-metering-point-identity.component.html',
})
export class DhMeteringPointIdentityComponent {
  #meteringPoint: MeteringPointCimDto | undefined;

  translationKeys: MeteringPointIdentityTranslationKeys | undefined;
  emDash = '—';

  @Input()
  set meteringPoint(value: MeteringPointCimDto | undefined) {
    if (value == undefined) {
      return;
    }

    this.#meteringPoint = value;
    this.translationKeys = this.buildTranslations(value);
  }
  get meteringPoint() {
    return this.#meteringPoint;
  }

  private buildTranslations(
    meteringPoint: MeteringPointCimDto
  ): MeteringPointIdentityTranslationKeys {
    const meteringMethod = `meteringPoint.meteringPointSubTypeCode.${meteringPoint?.meteringMethod}`;
    const meteringPointType = `meteringPoint.meteringPointTypeCode.${meteringPoint?.meteringPointType}`;
    const readingOccurrence = `meteringPoint.readingOccurrenceCode.${meteringPoint?.readingOccurrence}`;
    const settlementMethod = `meteringPoint.settlementMethodCode.${meteringPoint?.settlementMethod}`;

    return {
      meteringMethod,
      meteringPointType,
      readingOccurrence,
      settlementMethod,
    };
  }
}

@NgModule({
  declarations: [DhMeteringPointIdentityComponent],
  exports: [DhMeteringPointIdentityComponent],
  imports: [DhMeteringPointStatusBadgeScam, CommonModule, TranslocoModule],
})
export class DhMeteringPointIdentityScam {}
