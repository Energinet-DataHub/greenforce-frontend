import { NgModule } from '@angular/core';
import { WattModule } from '@energinet/watt';

import { ShellComponent } from './shell.component';

@NgModule({
  declarations: [ShellComponent],
  imports: [WattModule],
})
export class ShellModule {}
