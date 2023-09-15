import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://localhost:5001/graphql',
  config: { sort: false },
  documents: 'libs/**/*.graphql',
  generates: {
    './schema.graphql': {
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
          DateTimeOffset: 'Date',
        },
        scalarTypePolicies: {
          Date: 'libs/dh/shared/domain/src/lib/type-policies#dateTypePolicy',
          DateTimeOffset: 'libs/dh/shared/domain/src/lib/type-policies#dateTypePolicy',
          DateRange: 'libs/dh/shared/domain/src/lib/type-policies#dateRangeTypePolicy',
        },
      },
    },
  },
};

export default config;
