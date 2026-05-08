const baseConfig = require('../../eslint.config.js');
const nx = require('@nx/eslint-plugin');

module.exports = [
  ...baseConfig,
  { ignores: ['**/generated/**/*', '**/dist/**/*'] },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts', '**/*.html'],
    rules: {
      // TODO: enable after fixing existing template accessibility violations surfaced by the flat config migration.
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'dh',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'dh',
          style: 'kebab-case',
        },
      ],
    },
  },
];
