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
/* eslint-disable sonarjs/no-duplicate-string */

import { TestBed } from '@angular/core/testing';
import { TranslocoService, TranslocoTestingOptions } from '@jsverse/transloco';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util';

import { ApiErrorCollection, readApiErrorResponse } from './dh-market-participant-error-handling';

function generateErrors(args: { [key: string]: string | number } = {}): ApiErrorCollection[] {
  return [
    {
      apiErrors: [
        {
          message: 'Fallback message',
          code: 'domain.validation.feature.invalid_property',
          args,
          __typename: 'ApiErrorDescriptor',
        },
      ],
    },
  ];
}

function setup(translationObj: object = {}) {
  const translocoOptions: TranslocoTestingOptions = {
    langs: {
      en: {
        marketParticipant: {
          market_participant: {
            error_fallback: 'An error occurred: {{ message }}',
          },
          domain: {
            validation: {
              feature: translationObj,
            },
          },
        },
      },
    },
  };

  TestBed.configureTestingModule({
    imports: [getTranslocoTestingModule(translocoOptions)],
  });

  TestBed.inject(TranslocoService);
}

describe(readApiErrorResponse, () => {
  it('handle empty errors collection', () => {
    expect(readApiErrorResponse([])).toBe('');
  });

  it('use `message` property on error as fallback if translation does not exist ', () => {
    setup();

    const errors = generateErrors({
      arg_1: '570715000000058851',
    });

    const expected = 'An error occurred: Fallback message';
    expect(readApiErrorResponse(errors)).toBe(expected);
  });

  it('translate error without args', () => {
    const translationObj = {
      invalid_property: 'Translation for property without args',
    };

    setup(translationObj);

    const errors = generateErrors();

    const expected = 'Translation for property without args';
    expect(readApiErrorResponse(errors)).toBe(expected);
  });

  describe('translate error with args', () => {
    it('by using args as-is in translation', () => {
      const translationObj = {
        invalid_property: 'Arg 1: {{ arg_1 }} Arg 2: {{ arg_2 }}',
      };

      setup(translationObj);

      const errors = generateErrors({
        arg_1: 'FOUR AS-IS',
        arg_2: 'FIVE AS-IS',
      });

      const expected = 'Arg 1: FOUR AS-IS Arg 2: FIVE AS-IS';
      expect(readApiErrorResponse(errors)).toBe(expected);
    });

    it('by translating ALL args', () => {
      const translationObj = {
        args: {
          arg_1: {
            FOUR: 'FOUR Translated',
          },
          arg_2: {
            FIVE: 'FIVE Translated',
          },
        },
        invalid_property: 'Arg 1: {{ arg_1 }} Arg 2: {{ arg_2 }}',
      };

      setup(translationObj);

      const errors = generateErrors({
        arg_1: 'FOUR',
        arg_2: 'FIVE',
      });

      const expected = 'Arg 1: FOUR Translated Arg 2: FIVE Translated';
      expect(readApiErrorResponse(errors)).toBe(expected);
    });

    it('by translating SOME args', () => {
      const translationObj = {
        args: {
          arg_2: {
            FIVE: 'FIVE Translated',
          },
        },
        invalid_property: 'Arg 1: {{ arg_1 }} Arg 2: {{ arg_2 }}',
      };

      setup(translationObj);

      const errors = generateErrors({
        arg_1: '570715000000058851',
        arg_2: 'FIVE',
      });

      const expected = 'Arg 1: 570715000000058851 Arg 2: FIVE Translated';
      expect(readApiErrorResponse(errors)).toBe(expected);
    });
  });

  it('translate error with param in args', () => {
    const translationObj = {
      args: {
        param: {
          firstName: 'First name Translated',
        },
      },
      invalid_property: 'Arg 1: {{ arg_1 }} Param: {{ param }}',
    };

    setup(translationObj);

    const errors = generateErrors({
      arg_1: '570715000000058851',
      param: 'firstName',
    });

    const expected = 'Arg 1: 570715000000058851 Param: First name Translated';
    expect(readApiErrorResponse(errors)).toBe(expected);
  });
});
