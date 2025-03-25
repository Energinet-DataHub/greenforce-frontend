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
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'libs/dh/shared/data-access-graphql/schema.graphql',
  config: { sort: false },
  documents: 'libs/**/*.graphql',
  generates: {
    'libs/dh/shared/domain/src/lib/generated/graphql/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
        '@homebound/graphql-typescript-scalar-type-policies',
      ],
      config: {
        nonOptionalTypename: true,
        scalars: {
          UUID: 'string',
          Date: 'Date',
          DateRange: '{ start: Date, end: Date | null }',
          DateTime: 'Date',
        },
        scalarTypePolicies: {
          Date: 'libs/dh/shared/domain/src/lib/type-policies#dateTypePolicy',
          DateTime: 'libs/dh/shared/domain/src/lib/type-policies#dateTypePolicy',
          DateRange: 'libs/dh/shared/domain/src/lib/type-policies#dateRangeTypePolicy',
        },
      },
    },
    'libs/dh/shared/domain/src/lib/generated/graphql/msw.ts': {
      preset: 'import-types',
      plugins: ['typescript-msw'],
      presetConfig: {
        typesPath: './types',
      },
    },
    'libs/dh/shared/domain/src/lib/generated/graphql/introspection.ts': {
      plugins: ['fragment-matcher'],
    },
    'libs/dh/shared/domain/src/lib/generated/graphql/data-source.ts': {
      plugins: ['libs/dh/shared/feature-graphql-codegen/dist/apollo-data-source.js'],
    },
  },
};

export default config;
