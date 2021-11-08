import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WattButtonModule } from '@energinet-datahub/watt';

import { DhLanguageButtonComponent } from './dh-language-button.component';

@NgModule({
  declarations: [DhLanguageButtonComponent],
  exports: [DhLanguageButtonComponent],
  imports: [CommonModule, WattButtonModule],
})
export class DhLanguageButtonModule {}
