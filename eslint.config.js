const nx = require('@nx/eslint-plugin');
const importX = require('eslint-plugin-import-x');
const storybook = require('eslint-plugin-storybook');
const jsoncParser = require('jsonc-eslint-parser');
const graphqlEslint = require('@graphql-eslint/eslint-plugin');

module.exports = [
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
  },
  { ignores: ['**/obj/**', '**/bin/**'] },
  ...nx.configs['flat/base'],
  ...storybook.configs['flat/recommended'],

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          name: 'dayjs',
          message: "Please import 'dayjs' from '@energinet/watt/date' instead.",
        },
      ],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['@energinet/watt'],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:test-util',
                'type:shell',
                'type:environments',
                'type:assets',
                'type:styles',
              ],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: [
                'type:api',
                'type:app',
                'type:assets',
                'type:domain',
                'type:e2e-util',
              ],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:assets',
                'type:configuration',
                'type:data-access',
                'type:domain',
                'type:environments',
                'type:feature',
                'type:test-util',
                'type:ui',
                'type:util',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:util',
                'type:test-util',
                'type:domain',
                'type:assets',
                'type:styles',
                'type:environments',
              ],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:util',
                'type:test-util',
                'type:domain',
                'type:environments',
              ],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:test-util',
                'type:environments',
                'type:domain',
              ],
            },
            {
              sourceTag: 'type:test-util',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:data-access',
                'type:domain',
                'type:util',
                'type:test-util',
                'type:configuration',
                'type:assets',
              ],
            },
            {
              sourceTag: 'type:e2e-util',
              onlyDependOnLibsWithTags: ['type:util', 'type:test-util', 'type:e2e-util'],
            },
            {
              sourceTag: 'type:domain',
              onlyDependOnLibsWithTags: ['type:domain', 'type:util', 'type:test-util'],
            },
            {
              sourceTag: 'type:shell',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
                'type:test-util',
                'type:e2e-util',
                'type:shell',
                'type:domain',
                'type:configuration',
                'type:environments',
                'type:assets',
                'type:styles',
              ],
            },
            {
              sourceTag: 'type:configuration',
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:util',
                'type:test-util',
                'type:configuration',
                'type:environments',
                'type:domain',
                'type:assets',
              ],
            },
            {
              sourceTag: 'type:environments',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:test-util',
                'type:environments',
                'type:assets',
              ],
            },
            {
              sourceTag: 'type:assets',
              onlyDependOnLibsWithTags: ['type:assets'],
            },
            {
              sourceTag: 'type:styles',
              onlyDependOnLibsWithTags: ['type:assets', 'type:styles'],
            },
            {
              sourceTag: 'product:dh',
              onlyDependOnLibsWithTags: ['product:dh', 'product:gf', 'product:watt'],
            },
            {
              sourceTag: 'product:gf',
              onlyDependOnLibsWithTags: ['product:gf'],
            },
            {
              sourceTag: 'product:watt',
              onlyDependOnLibsWithTags: ['product:watt', 'type:test-util'],
            },
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  ...nx.configs['flat/typescript'],

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'no-extra-semi': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'error',
    },
  },

  {
    ...importX.flatConfigs.typescript,
    files: ['**/*.ts', '**/*.tsx'],
  },

  ...nx.configs['flat/angular-template'].map((config) => ({
    ...config,
    files: ['**/*.component.html'],
    rules: {
      ...config.rules,
      '@angular-eslint/template/prefer-self-closing-tags': ['error'],
    },
  })),

  ...nx.configs['flat/javascript'],

  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  {
    files: ['**/*.json'],
    languageOptions: { parser: jsoncParser },
    rules: {},
  },

  {
    files: ['**/*.graphql'],
    ignores: ['**/schema.graphql'],
    plugins: { '@graphql-eslint': graphqlEslint },
    languageOptions: { parser: graphqlEslint.parser },
    rules: {
      ...graphqlEslint.configs['flat/operations-recommended'].rules,
      '@graphql-eslint/naming-convention': ['off'],
    },
  },

  {
    files: ['**/schema.graphql'],
    plugins: { '@graphql-eslint': graphqlEslint },
    languageOptions: { parser: graphqlEslint.parser },
    rules: {
      ...graphqlEslint.configs['flat/schema-recommended'].rules,
      '@graphql-eslint/require-description': 'off',
      '@graphql-eslint/description-style': ['off'],
      '@graphql-eslint/no-typename-prefix': ['off'],
      '@graphql-eslint/no-unreachable-types': ['off'],
      '@graphql-eslint/strict-id-in-types': [
        'off',
        {
          acceptedIdTypes: ['UUID'],
          exceptions: {
            suffixes: ['Payload'],
          },
        },
      ],
      '@graphql-eslint/naming-convention': [
        'off',
        {
          types: 'PascalCase',
          FieldDefinition: 'camelCase',
          InputValueDefinition: 'camelCase',
          Argument: 'camelCase',
          DirectiveDefinition: 'camelCase',
          'EnumTypeDefinition[name.value!=/^UI/] > EnumValueDefinition': {
            style: 'UPPER_CASE',
          },
          'EnumTypeDefinition[name.value=/^UI/] > EnumValueDefinition': {
            ignorePattern: '.*',
          },
          'FieldDefinition[parent.name.value=Query]': {
            forbiddenPrefixes: ['query', 'get'],
            forbiddenSuffixes: ['Query'],
          },
          'FieldDefinition[parent.name.value=Mutation]': {
            forbiddenPrefixes: ['mutation'],
            forbiddenSuffixes: ['Mutation'],
          },
          'FieldDefinition[parent.name.value=Subscription]': {
            forbiddenPrefixes: ['subscription'],
            forbiddenSuffixes: ['Subscription'],
          },
          'EnumTypeDefinition,EnumTypeExtension': {
            forbiddenPrefixes: ['Enum'],
            forbiddenSuffixes: ['Enum'],
          },
          'InterfaceTypeDefinition,InterfaceTypeExtension': {
            forbiddenPrefixes: ['Interface'],
            forbiddenSuffixes: ['Interface'],
          },
          'UnionTypeDefinition,UnionTypeExtension': {
            forbiddenPrefixes: ['Union'],
            forbiddenSuffixes: ['Union'],
          },
          'ObjectTypeDefinition,ObjectTypeExtension': {
            forbiddenPrefixes: ['Type'],
            forbiddenSuffixes: ['Type'],
          },
        },
      ],
    },
  },

  {
    files: ['**/eslint.config.{js,cjs,mjs}'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },

  {
    settings: {
      'import-x/internal-regex': '^@energinet',
    },
  },
];
