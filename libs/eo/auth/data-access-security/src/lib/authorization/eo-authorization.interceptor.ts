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
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FeatureFlagService } from '@energinet-datahub/eo/shared/services';
import { Observable, tap, take } from 'rxjs';

/**
 * Displays an error when the user has insufficient permissions.
 */
@Injectable()
export class EoAuthorizationInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private featureFlagService: FeatureFlagService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    nextHandler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return nextHandler.handle(request).pipe(
      tap({
        next: () => {
          this.#checkForFeatureFlaggingInQueryParams();
        },
        error: (error) => {
          if (this.#is403ForbiddenResponse(error)) {
            this.#displayPermissionError();
          }
        },
      })
    );
  }

  #displayPermissionError(): Observable<void> {
    return this.snackBar
      .open('You do not have permission to perform this action.')
      .afterOpened();
  }

  #checkForFeatureFlaggingInQueryParams() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      if (params['enableFeature']) {
        this.featureFlagService.enableFeatureFlag(params['enableFeature']);
        return;
      }
      if (params['disableFeature']) {
        this.featureFlagService.disableFeatureFlag(params['disableFeature']);
      }
    });
  }

  #is403ForbiddenResponse(error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      error.status === HttpStatusCode.Forbidden
    );
  }
}

export const eoAuthorizationInterceptorProvider: ClassProvider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: EoAuthorizationInterceptor,
};
