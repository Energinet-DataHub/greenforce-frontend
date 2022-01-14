import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DhMeteringPointIdentityScam } from './identity/dh-metering-point-identity.component';

@NgModule({
  exports: [DhMeteringPointIdentityScam],
  imports: [CommonModule],
})
export class DhMeteringPointFeatureIdentityAndMasterDataModule {}
