/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DisplayLanguage,
  displayLanguages,
  toDisplayLanguage,
} from '@energinet-datahub/dh/globalization/domain';
import { TranslocoService } from '@ngneat/transloco';
import { map, Observable, tap } from 'rxjs';

import { WattLocaleService } from '@energinet-datahub/watt/locale';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-language-picker',
  templateUrl: './dh-language-picker.component.html',
  styleUrls: ['./dh-language-picker.component.scss'],
})
export class DhLanguagePickerComponent {
  activeLanguage$: Observable<DisplayLanguage> =
    this.transloco.langChanges$.pipe(
      map(toDisplayLanguage),
      tap((language) => {
        this.localeService.setActiveLocale(language);
      })
    );
  displayLanguages = displayLanguages;

  constructor(
    private transloco: TranslocoService,
    private localeService: WattLocaleService
  ) {}

  onLanguageSelect(language: DisplayLanguage): void {
    this.transloco.setActiveLang(language);
  }
}
