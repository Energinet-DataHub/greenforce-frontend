import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WattModule } from '@energinet/watt';

import { ShellComponent } from './shell.component';

@NgModule({
  declarations: [ShellComponent],
  imports: [RouterModule, WattModule],
})
export class ShellModule {}
