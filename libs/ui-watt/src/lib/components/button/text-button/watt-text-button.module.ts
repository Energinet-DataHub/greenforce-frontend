import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { WattTextButtonComponent } from './watt-text-button.component';

@NgModule({
  declarations: [WattTextButtonComponent],
  imports: [CommonModule, MatButtonModule],
})
export class WattTextButtonModule {}
