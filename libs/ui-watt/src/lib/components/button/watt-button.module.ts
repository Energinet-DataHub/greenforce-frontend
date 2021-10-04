import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { WattLinkButtonModule } from './link-button/watt-link-button.module';
import { WattButtonComponent } from './watt-button.component';
import { WattPrimaryButtonModule } from './primary-button/watt-primary-button.module';
import { WattPrimaryLinkButtonModule } from './primary-link-button/watt-primary-link-button.module';
import { WattSecondaryButtonModule } from './secondary-button/watt-secondary-button.module';
import { WattSecondaryLinkButtonModule } from './secondary-link-button/watt-secondary-link-button.module';
import { WattTextButtonModule } from './text-button/watt-text-button.module';

@NgModule({
  declarations: [WattButtonComponent],
  exports: [WattButtonComponent],
  imports: [
    CommonModule,
    MatIconModule,
    WattTextButtonModule,
    WattLinkButtonModule,
    WattSecondaryButtonModule,
    WattSecondaryLinkButtonModule,
    WattPrimaryButtonModule,
    WattPrimaryLinkButtonModule,
  ],
})
export class WattButtonModule {}
