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
  inject,
  Input,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { WattToastService } from '../toast';
import { WattClipboardIntlService } from './watt-clipboard-intl.service';

@Directive({
  standalone: true,
  selector: '[wattCopyToClipboard]',
})
export class WattCopyToClipboardDirective {
  private element = inject(ElementRef);
  private clipboard = inject(Clipboard);
  private toast = inject(WattToastService);
  private intl = inject(WattClipboardIntlService);

  @Input('wattCopyToClipboard')
  text?: string;

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
        message: this.intl.success,
      });
    } else {
      this.toast.open({
        type: 'danger',
        message: this.intl.error,
      });
    }
  }
}
