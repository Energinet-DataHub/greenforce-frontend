import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ShellComponent } from './shell.component';

@NgModule({
  declarations: [ShellComponent],
  exports: [ShellComponent],
  imports: [MatSidenavModule, MatToolbarModule],
})
export class ShellModule {}
