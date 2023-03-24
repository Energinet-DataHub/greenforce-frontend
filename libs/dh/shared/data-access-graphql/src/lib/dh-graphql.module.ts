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
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';

import { DhApiEnvironment, dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

import { errorHandler } from './error-handler';

/**
 * Do not import directly. Use `DhGraphQLModule.forRoot`.
 */
@NgModule({
  imports: [ApolloModule],
})
export class DhGraphQLModule {
  /**
   * Registers root-level DataHub GraphQL dependencies.
   */
  static forRoot(): ModuleWithProviders<DhGraphQLModule> {
    return {
      ngModule: DhGraphQLModule,
      providers: [
        {
          provide: APOLLO_OPTIONS,
          useFactory(
            httpLink: HttpLink,
            dhApiEnvironment: DhApiEnvironment,
            dhApplicationInsights: DhApplicationInsights
          ) {
            return {
              cache: new InMemoryCache({
                typePolicies: {
                  Query: {
                    fields: {
                      batch(_, { args, toReference }) {
                        return toReference({
                          __typename: 'Batch',
                          id: args?.['id'],
                        });
                      },
                    },
                  },
                },
              }),
              link: ApolloLink.from([
                errorHandler(dhApplicationInsights),
                httpLink.create({ uri: `${dhApiEnvironment.apiBase}/graphql` }),
              ]),
            };
          },
          deps: [HttpLink, dhApiEnvironmentToken, DhApplicationInsights],
        },
      ],
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule?: DhGraphQLModule
  ) {
    if (parentModule) {
      throw new Error('DhGraphQLModule is already loaded. Import it in the AppModule only');
    }
  }
}
