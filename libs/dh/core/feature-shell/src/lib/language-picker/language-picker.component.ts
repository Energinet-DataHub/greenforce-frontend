import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DisplayLanguage,
  displayLanguages,
  toDisplayLanguage,
} from '@energinet-datahub/dh/globalization/domain';
import { TranslocoService } from '@ngneat/transloco';
import { map, Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-language-picker',
  templateUrl: './language-picker.component.html',
  styleUrls: ['./language-picker.component.scss'],
})
export class LanguagePickerComponent {
  activeLanguage$: Observable<DisplayLanguage> =
    this.transloco.langChanges$.pipe(map(toDisplayLanguage));
  displayLanguages = displayLanguages;

  constructor(private transloco: TranslocoService) {}

  onLanguageSelect(language: DisplayLanguage): void {
    this.transloco.setActiveLang(language);
  }
}
