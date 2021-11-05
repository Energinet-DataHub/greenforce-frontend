import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WattButtonModule } from '@energinet-datahub/watt';

import { LanguageButtonComponent } from './language-button.component';

@NgModule({
  declarations: [LanguageButtonComponent],
  exports: [LanguageButtonComponent],
  imports: [CommonModule, WattButtonModule],
})
export class LanguageButtonModule {}
