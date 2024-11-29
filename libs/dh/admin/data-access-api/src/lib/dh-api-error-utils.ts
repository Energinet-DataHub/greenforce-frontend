import { HttpErrorResponse } from '@angular/common/http';

import { ApiError } from '@energinet-datahub/dh/shared/domain/graphql';

export type ApiErrorCollection = Pick<ApiError, 'apiErrors'>;

export function createApiErrorCollection(errorResponse: HttpErrorResponse): ApiErrorCollection {
  return { apiErrors: errorResponse.error?.errors ?? [] };
}
