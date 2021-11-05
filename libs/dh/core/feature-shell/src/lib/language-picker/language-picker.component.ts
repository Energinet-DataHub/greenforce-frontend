import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { map, Observable } from 'rxjs';

import {
  DisplayLanguage,
  displayLanguages,
  fromLanguage,
} from '../display-language';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-language-picker',
  templateUrl: './language-picker.component.html',
  styleUrls: ['./language-picker.component.scss'],
})
export class LanguagePickerComponent {
  activeLanguage$: Observable<DisplayLanguage> =
    this.transloco.langChanges$.pipe(map(fromLanguage));
  displayLanguages = displayLanguages;

  constructor(private transloco: TranslocoService) {}

  onLanguageSelect(language: DisplayLanguage): void {
    this.transloco.setActiveLang(language);
  }
}
