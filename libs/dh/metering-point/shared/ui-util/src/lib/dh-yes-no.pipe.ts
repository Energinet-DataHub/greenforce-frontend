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
import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

type TValue = string | boolean | undefined | null;

@Pipe({
  name: 'dhYesNo',
  pure: false,
  standalone: true,
})
export class DhYesNoPipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  transform(value: TValue) {
    if (value == null) {
      return '';
    }

    if (this.isFalsy(value)) {
      return this.transloco.translate('no');
    }

    return this.transloco.translate('yes');
  }

  private isFalsy(value: TValue): boolean {
    if (typeof value === 'string') {
      return value.trim() === '';
    }

    return value === false;
  }
}
