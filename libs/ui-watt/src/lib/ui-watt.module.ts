import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AutocompleteModule } from './components/autocomplete/autocomplete.module';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, AutocompleteModule],
  exports: [AutocompleteModule],
})
export class WattModule {}
