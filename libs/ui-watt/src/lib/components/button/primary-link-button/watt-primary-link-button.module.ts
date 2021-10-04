import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { WattPrimaryLinkButtonComponent } from './watt-primary-link-button.component';

@NgModule({
  declarations: [WattPrimaryLinkButtonComponent],
  imports: [RouterModule, MatButtonModule],
})
export class WattPrimaryLinkButtonModule {}
