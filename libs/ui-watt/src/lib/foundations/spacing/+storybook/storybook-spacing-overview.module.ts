import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { StorybookSpacingOverviewComponent } from './storybook-spacing-overview.component';

@NgModule({
  declarations: [StorybookSpacingOverviewComponent],
  exports: [StorybookSpacingOverviewComponent],
  imports: [CommonModule, MatCardModule, MatTableModule],
})
export class StorybookSpacingOverviewModule {}
