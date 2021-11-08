import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetModule } from '@rx-angular/template';

import { DhLanguageButtonModule } from '../language-button/dh-language-button.module';
import { DhLanguagePickerComponent } from './dh-language-picker.component';

@NgModule({
  declarations: [DhLanguagePickerComponent],
  exports: [DhLanguagePickerComponent],
  imports: [CommonModule, LetModule, DhLanguageButtonModule],
})
export class DhLanguagePickerModule {}
