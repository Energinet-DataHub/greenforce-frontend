import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.graphql',
  documents: 'libs/**/*.graphql',
  generates: {
    'libs/dh/shared/domain/src/lib/graphql.ts': {
      plugins: [
        { add: { content: '/* eslint-disable */' } },
        'typescript',
        'typescript-operations',
        'typed-document-node',
        'typescript-msw',
      ],
    },
    './apps/dh/api-dh/source/DataHub.WebApi/bin/Release/net6.0/schema.graphql': {
      plugins: ['schema-ast'],
    },
    './dist/apps/dh/api-dh/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
