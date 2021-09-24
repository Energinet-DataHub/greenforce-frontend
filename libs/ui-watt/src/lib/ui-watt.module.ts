import { NgModule } from '@angular/core';

import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
import { ShellModule } from './components/shell/shell.module';

@NgModule({
  exports: [AutocompleteModule, ShellModule],
})
export class WattModule {}
