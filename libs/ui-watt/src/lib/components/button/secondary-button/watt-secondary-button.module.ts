import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { WattSecondaryButtonComponent } from './watt-secondary-button.component';

@NgModule({
  declarations: [WattSecondaryButtonComponent],
  imports: [CommonModule, MatButtonModule],
})
export class WattSecondaryButtonModule {}
