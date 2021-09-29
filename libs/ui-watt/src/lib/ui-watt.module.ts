import { NgModule } from '@angular/core';

import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
import { ShellModule } from './components/shell/shell.module';

@NgModule({
  providers: [
    { provide: Window, useValue: window }
  ],
  exports: [AutocompleteModule, ShellModule],
})
export class WattModule {}
