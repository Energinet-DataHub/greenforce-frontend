import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WattIconModule } from '@energinet-datahub/watt';

import { DhBreadcrumbsComponent } from './dh-breadcrumbs.component';

@NgModule({
  declarations: [DhBreadcrumbsComponent],
  exports: [DhBreadcrumbsComponent],
  imports: [CommonModule, RouterModule, WattIconModule],
})
export class DhBreadcrumbsModule {}
