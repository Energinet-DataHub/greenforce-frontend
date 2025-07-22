//#region License
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
//#endregion
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentageOf',
  pure: true,
})
export class PercentageOfPipe implements PipeTransform {
  transform(value: number, total: number): string {
    if (!value || total === 0) {
      return 0 + '%';
    }
    const result = Math.round((value / total) * 100);
    if (result === 100 && value < total) {
      return '99%';
    } else if (result >= 1) {
      return result + '%';
    } else {
      return '<1%';
    }
  }
}
