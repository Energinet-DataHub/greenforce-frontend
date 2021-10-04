import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { WattPrimaryButtonComponent } from './watt-primary-button.component';

@NgModule({
  declarations: [WattPrimaryButtonComponent],
  imports: [CommonModule, MatButtonModule],
})
export class WattPrimaryButtonModule {}
