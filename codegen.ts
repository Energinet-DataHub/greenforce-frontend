import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://localhost:5001/graphql',
  documents: 'libs/**/*.graphql',
  generates: {
    './schema.graphql': {
      plugins: ['schema-ast'],
    },
    'libs/dh/shared/domain/src/lib/graphql.ts': {
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
        },
      },
    },
  },
};

export default config;
