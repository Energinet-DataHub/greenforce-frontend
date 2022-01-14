import {
  Component,
  Input,
  NgModule,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/data-access-api';

import { DhMeteringPointIdentityScam } from './identity/dh-metering-point-identity.component';
import { DhMeteringPointPrimaryMasterDataScam } from './primary-master-data/dh-metering-point-primary-master-data.component';
import { DhSecondaryMasterDataComponentScam } from './secondary-master-data/dh-secondary-master-data.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-identity-and-master-data',
  templateUrl: './dh-metering-point-identity-and-master-data.template.html',
})
export class DhMeteringPointIdentityAndMasterDataComponent {
  @Input() meteringPoint: MeteringPointCimDto | undefined;
}

@NgModule({
  declarations: [DhMeteringPointIdentityAndMasterDataComponent],
  exports: [DhMeteringPointIdentityAndMasterDataComponent],
  imports: [
    CommonModule,
    DhMeteringPointIdentityScam,
    DhMeteringPointPrimaryMasterDataScam,
    DhSecondaryMasterDataComponentScam,
  ],
})
export class DhMeteringPointIdentityAndMasterDataScam {}
