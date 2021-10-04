import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { WattSecondaryLinkButtonComponent } from './watt-secondary-link-button.component';

@NgModule({
  declarations: [WattSecondaryLinkButtonComponent],
  imports: [RouterModule, MatButtonModule],
})
export class WattSecondaryLinkButtonModule {}
