import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'libs/dh/shared/data-access-graphql/schema.graphql',
  config: { sort: false },
  documents: 'libs/**/*.graphql',
  generates: {
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
  },
};

export default config;
