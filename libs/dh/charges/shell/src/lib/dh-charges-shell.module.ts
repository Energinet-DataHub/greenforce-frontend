import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  DhChargesPricesComponent,
  DhChargesPricesScam
} from "@energinet-datahub/dh/charges/feature-prices";
import {
  dhChargesPricesPath
} from '@energinet-datahub/dh-charges-routing';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: dhChargesPricesPath
  },
  {
    path: dhChargesPricesPath,
    pathMatch: 'full',
    component: DhChargesPricesComponent,
    data: {
      titleTranslationKey: 'charges.prices.topBarTitle',
    },
  }
];

@NgModule({
  imports: [
    DhChargesPricesScam,
    RouterModule.forChild(routes)
  ],
})
export class DhChargesShellModule {}
