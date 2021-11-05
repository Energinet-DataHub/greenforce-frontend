import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetModule } from '@rx-angular/template';

import { LanguageButtonModule } from '../language-button/language-button.module';
import { LanguagePickerComponent } from './language-picker.component';

@NgModule({
  declarations: [LanguagePickerComponent],
  exports: [LanguagePickerComponent],
  imports: [CommonModule, LetModule, LanguageButtonModule],
})
export class LanguagePickerModule {}
