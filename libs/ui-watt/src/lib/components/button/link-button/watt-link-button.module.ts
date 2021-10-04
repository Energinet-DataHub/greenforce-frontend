import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { WattLinkButtonComponent } from './watt-link-button.component';

@NgModule({
  declarations: [WattLinkButtonComponent],
  imports: [RouterModule, MatButtonModule],
})
export class WattLinkButtonModule {}
