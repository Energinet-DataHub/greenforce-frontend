import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DhMeteringPointChildComponent } from '@energinet-datahub/dh/metering-point/feature-child';
import { DhMeteringPointDetailsComponent } from '@energinet-datahub/dh/metering-point/feature-details';
import { DhMeteringPointSearchComponent } from '@energinet-datahub/dh/metering-point/feature-search';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'search', component: DhMeteringPointSearchComponent },
  {
    path: ':id',
    component: DhMeteringPointDetailsComponent,
  },
  { path: ':id/child/:child-id', component: DhMeteringPointChildComponent },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DhMeteringPointShellModule {}
