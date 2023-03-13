import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.graphql',
  documents: 'libs/**/*.graphql',
  generates: {
    './apps/dh/api-dh/source/DataHub.WebApi/bin/Release/net6.0/schema.graphql': {
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
      ],
      config: {
        scalars: {
          DateRange: '{ start: string, end: string}',
          DateTimeOffset: 'string',
        },
      },
    },
  },
};

export default config;
