import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DhMeteringPointIdentityScam } from './identity/dh-metering-point-identity.component';
import { DhMeteringPointPrimaryMasterDataScam } from './primary-master-data/dh-metering-point-primary-master-data.component';
import { DhSecondaryMasterDataComponentScam } from './secondary-master-data/dh-secondary-master-data.component';

@NgModule({
  exports: [
    DhMeteringPointIdentityScam,
    DhMeteringPointPrimaryMasterDataScam,
    DhSecondaryMasterDataComponentScam,
  ],
  imports: [CommonModule],
})
export class DhMeteringPointFeatureIdentityAndMasterDataModule {}
