import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.graphql',
  config: { sort: false },
  documents: 'libs/**/*.graphql',
  generates: {
    './apps/dh/api-dh/source/DataHub.WebApi/bin/Release/net8.0/schema.graphql': {
      plugins: ['schema-ast'],
    },
    './dist/apps/dh/api-dh/schema.graphql': {
      plugins: ['schema-ast'],
    },
    'libs/dh/shared/domain/src/lib/generated/graphql.ts': {
      plugins: [
        { add: { content: '/* eslint-disable */' } },
        'typescript',
        'typescript-operations',
        'typed-document-node',
        'typescript-msw',
        '@homebound/graphql-typescript-scalar-type-policies',
      ],
      config: {
        nonOptionalTypename: true,
        scalars: {
          Date: 'Date',
          DateRange: '{ start: Date, end: Date }',
          DateTime: 'Date',
        },
        scalarTypePolicies: {
          Date: 'libs/dh/shared/domain/src/lib/type-policies#dateTypePolicy',
          DateTime: 'libs/dh/shared/domain/src/lib/type-policies#dateTypePolicy',
          DateRange: 'libs/dh/shared/domain/src/lib/type-policies#dateRangeTypePolicy',
        },
      },
    },
  },
};

export default config;
