import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
import { ShellModule } from './components/shell/shell.module';

@NgModule({
  imports: [BrowserAnimationsModule, AutocompleteModule],
  exports: [AutocompleteModule, ShellModule],
})
export class WattModule {}
