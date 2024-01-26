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
import { MASKITO_DEFAULT_OPTIONS, MaskitoOptions } from '@maskito/core';
import { ElementState } from '@maskito/core/src/lib/types';

const TIME_FIXED_CHARACTERS = [':', '.'];

const SEPARATOR = ' - ';

export function maskitoTimeRangeOptionsGenerator(): Required<MaskitoOptions> {
  return {
    ...MASKITO_DEFAULT_OPTIONS,
    mask: [
      ...Array.from('HH:MM').map((char) => (TIME_FIXED_CHARACTERS.includes(char) ? char : /\d/)),
      ...Array.from(SEPARATOR),
      ...Array.from('HH:MM').map((char) => (TIME_FIXED_CHARACTERS.includes(char) ? char : /\d/)),
    ],
    preprocessors: [
      ({ elementState, data }, actionType) => {
        if (actionType !== 'insert' || data.length > 1) {
          return {
            elementState,
            data,
          };
        }
        if (Number.parseInt(data) > 2 && isFirstHourSegment(elementState)) {
          return {
            elementState: {
              selection: elementState.selection,
              value: elementState.value + '0' + data,
            },
            data: '0' + data,
          };
        }
        if (
          Number.parseInt(data) > 5 &&
          (elementState.value.length === 3 || elementState.value.length === 10)
        ) {
          return {
            elementState: {
              selection: elementState.selection,
              value: elementState.value + '0' + data,
            },
            data: '0' + data,
          };
        }
        return {
          elementState,
          data,
        };
      },
    ],
    overwriteMode: 'replace',
  };
}
function isFirstHourSegment(elementState: ElementState) {
  if (elementState.value.length === 0) {
    return true;
  }
  if (elementState.value.endsWith(SEPARATOR)) {
    return elementState.value.length === 8;
  }
  if (elementState.value.endsWith(' -')) {
    return elementState.value.length === 7;
  }
  if (elementState.value.endsWith(' ')) {
    return elementState.value.length === 6;
  }
  return elementState.value.length === 5;
}
