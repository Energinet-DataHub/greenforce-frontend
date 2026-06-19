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
import baseConfig from '../../eslint.config';
import nx from '@nx/eslint-plugin';
import angular from '@angular-eslint/eslint-plugin';

const config: unknown[] = [
  ...baseConfig,
  { ignores: ['storybook-static/**', 'node_modules/**'] },
  {
    rules: {
      'storybook/no-uninstalled-addons': ['error', { packageJsonLocation: '../../package.json' }],
    },
  },
  {
    files: ['**/*.ts'],
    plugins: { '@angular-eslint': angular },
  },
  ...nx.configs['flat/angular'].map((config) => ({
    ...config,
    files: ['**/*.ts'],
    ignores: ['**/*.stories.ts', '**/+storybook/**/*.ts', '**/*.spec.ts'],
  })),
  {
    files: ['**/*.ts'],
    ignores: ['**/*.stories.ts', '**/+storybook/**/*.ts', '**/*.spec.ts'],
    rules: {
      'import-x/no-relative-parent-imports': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['watt', 'vater'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['watt', 'vater'],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['package/**/*.ts', 'test/**/*.ts'],
    rules: {
      // TODO(watt packaging): Replace existing parent-relative package/test imports, then enable this.
      'import-x/no-relative-parent-imports': 'off',
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts', '**/*.html'],
    rules: {
      // TODO(watt accessibility): Fix Watt clickable-template, label, and content issues, then enable these.
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/elements-content': 'off',
    },
  },
  {
    files: ['package/table/watt-table.component.ts'],
    rules: {
      // TODO(watt table): Refactor template context guard signatures, then remove the context ignore.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^context$' }],
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      // TODO(watt accessibility): Replace existing drawer autofocus behavior, then enable this.
      '@angular-eslint/template/no-autofocus': 'off',
    },
  },
];

export default config;

