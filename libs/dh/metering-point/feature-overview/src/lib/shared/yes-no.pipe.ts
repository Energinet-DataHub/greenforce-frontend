/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

export type TValue = string | boolean | undefined | null;
export const pipeName = 'yesNo';

@Pipe({
  name: pipeName,
  pure: false,
})
export class YesNoPipe implements PipeTransform {
  transform(value: TValue) {
    if (value == null) {
      return;
    }

    if (this.isFalsy(value)) {
      return this.transloco.translate('no');
    }

    return this.transloco.translate('yes');
  }

  constructor(private transloco: TranslocoService) {}

  private isFalsy(value: TValue): boolean {
    if (typeof value === 'string') {
      return value.trim() === '';
    }

    return value === false;
  }
}

@NgModule({
  declarations: [YesNoPipe],
  imports: [TranslocoModule],
  exports: [YesNoPipe],
})
export class DhYesNoPipeScam {}
