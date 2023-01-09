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
import { NgModule, Pipe, PipeTransform } from '@angular/core';

import { emDash } from './em-dash';

export type TValue = string | number | undefined | null;
export const pipeName = 'dhEmDashFallback';

@Pipe({
  name: pipeName,
})
export class DhEmDashFallbackPipe implements PipeTransform {
  transform(value: TValue): string | number {
    if (this.isFalsy(value)) {
      return emDash;
    }

    return value as string | number;
  }

  private isFalsy(value: TValue): boolean {
    if (typeof value === 'string') {
      return value.trim() === '';
    }

    return value == null;
  }
}

@NgModule({
  declarations: [DhEmDashFallbackPipe],
  exports: [DhEmDashFallbackPipe],
})
export class DhEmDashFallbackPipeScam {}
