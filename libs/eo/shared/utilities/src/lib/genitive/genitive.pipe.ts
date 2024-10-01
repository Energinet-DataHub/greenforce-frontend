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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genitive',
  standalone: true,
})
export class EoGenitivePipe implements PipeTransform {
  transform(value: string, language: string): string {
    if (!value) {
      return '';
    }

    const lastChar = value.charAt(value.length - 1);

    if (language === 'da') {
      // Danish rules
      if (lastChar.toLocaleLowerCase() === 's') {
        return `${value}'`; // Just add an apostrophe if it ends with 's'
      } else {
        return `${value}s`; // Add 's' otherwise
      }
    } else if (language === 'en') {
      // English rules
      if (lastChar.toLocaleLowerCase() === 's') {
        return `${value}'`; // Just add an apostrophe if it ends with 's'
      } else {
        console.log(value);
        return `${value}'s`; // Add 's otherwise'
      }
    }

    return value; // Fallback if language is not recognized
  }
}
