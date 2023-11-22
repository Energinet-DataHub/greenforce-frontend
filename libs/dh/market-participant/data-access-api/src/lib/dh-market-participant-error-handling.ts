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

import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '@energinet-datahub/dh/shared/domain/graphql';
import { translate } from '@ngneat/transloco';

interface ServerErrorDescriptor {
  error: ErrorDescriptor;
}

interface ErrorDescriptor {
  code: string;
  message: string;
  target?: string;
  details?: ErrorDescriptor[];
}

type ApiErrorWithoutHeaders = Omit<ApiError, 'headers'>;

interface ClientErrorDescriptor {
  errors: {
    [s: string]: string;
  };
}

export const parseApiErrorResponse = (errorResponse: ApiErrorWithoutHeaders[]) => {
  return errorResponse
    .map((x) => {
      if (x.response) {
        const errorDescriptor = JSON.parse(x.response) as ServerErrorDescriptor;
        return getTranslatedError(errorDescriptor);
      }
      return x.message;
    })
    .join(' ');
};

export const parseErrorResponse = (errorResponse: HttpErrorResponse) => {
  const errorDescriptor: ServerErrorDescriptor | ClientErrorDescriptor = errorResponse.error;
  return getTranslatedError(errorDescriptor);
};

const getTranslatedError = (errorDescriptor: ServerErrorDescriptor | ClientErrorDescriptor) => {
  if (isServerErrorDescriptor(errorDescriptor)) {
    if (errorDescriptor.error.details) {
      return errorDescriptor.error.details
        .map((x) => {
          const translationKey = `marketParticipant.apiErrorCodes.${x.code[0].toLowerCase()}${[
            x.code.slice(1),
          ]}`;
          const translation = translate(translationKey);
          return translation === translationKey ? x.message : translation;
        })
        .join(' ');
    }
    return errorDescriptor.error.message;
  }
  return Object.values(errorDescriptor.errors).join(' ');
};

const isServerErrorDescriptor = (
  errorDescriptor: ServerErrorDescriptor | ClientErrorDescriptor
): errorDescriptor is ServerErrorDescriptor =>
  (<ServerErrorDescriptor>errorDescriptor).error !== undefined;
