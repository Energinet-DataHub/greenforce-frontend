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
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { WattToastComponent, WattToastService } from '../toast';
import da from './i18n/da.json';
import en from './i18n/en.json';
import { WattTranslationService } from '../../utils/translation';

@Directive({
  standalone: true,
  selector: '[wattCopyToClipboard]',
})
export class WattCopyToClipboardDirective {
  @Input('wattCopyToClipboard') text?: string;

  constructor(
    private element: ElementRef,
    private clipboard: Clipboard,
    private toast: WattToastService,
    private translation: WattTranslationService
  ) {
    this.translation.addTranslation('clipboard', en, 'en');
    this.translation.addTranslation('clipboard', da, 'da');
  }

  @HostBinding('style.cursor')
  cursor = 'pointer';

  @HostListener('click')
  onClick() {
    const success = this.text
      ? this.clipboard.copy(this.text)
      : this.clipboard.copy(this.element.nativeElement.innerText);

    if (success) {
      this.toast.open({
        type: 'success',
        message: this.translation.translate('clipboard.success'),
      });
    } else {
      this.toast.open({
        type: 'danger',
        message: this.translation.translate('clipboard.error'),
      });
    }
  }
}

export const WATT_COPY_TO_CLIPBOARD_DEPS = [
  WattToastComponent,
  WattCopyToClipboardDirective,
] as const;
