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
import { NgFor, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { DisplayLanguage, displayLanguages } from '@energinet-datahub/gf/globalization/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-language-button',
  templateUrl: './dh-language-button.component.html',
  styleUrls: ['./dh-language-button.component.scss'],
  standalone: true,
  imports: [NgFor, UpperCasePipe, MatButtonToggleModule],
  encapsulation: ViewEncapsulation.None,
})
export class DhLanguageButtonComponent {
  displayLanguages = displayLanguages;
  @Input()
  activeLanguage = DisplayLanguage.Danish;
  @Output()
  activeLanguageSelect = new EventEmitter<DisplayLanguage>();

  onLanguageChange(value: DisplayLanguage) {
    this.activeLanguageSelect.emit(value);
  }
}
