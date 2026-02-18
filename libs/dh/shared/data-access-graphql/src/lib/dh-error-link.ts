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
import { inject, Injectable } from '@angular/core';
import { onError } from '@apollo/client/link/error';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

@Injectable({ providedIn: 'root' })
export class DhErrorLink {
  private readonly appInsights = inject(DhApplicationInsights);
  create = () =>
    onError(({ graphQLErrors, networkError, operation }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, extensions }) => {
          this.appInsights.trackException(
            new Error((extensions?.['details'] as string) ?? message),
            SeverityLevel.Error
          );
        });
      }

      if (networkError) {
        const status = 'status' in networkError ? networkError.status : 'unknown';
        this.appInsights.trackException(
          new Error(
            `GraphQL network error for ${operation.operationName}: ${networkError.message} (status: ${status})`
          ),
          SeverityLevel.Critical
        );
      }
    });
}
