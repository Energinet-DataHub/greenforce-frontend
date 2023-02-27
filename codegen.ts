import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './graphql.schema.json',
  documents: 'libs/**/*.graphql',
  generates: {
    'libs/dh/shared/domain/src/lib/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node', 'typescript-msw'],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
