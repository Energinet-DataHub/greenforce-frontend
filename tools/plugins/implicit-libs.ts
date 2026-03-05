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
import { CreateNodesV2 } from '@nx/devkit';

/**
 * Ordered list of known type prefixes, longest-first so that
 * "data-access" is matched before "data", and "test-util" before "test".
 */
const TYPE_PREFIXES: readonly string[] = [
  'data-access',
  'test-util',
  'e2e-util',
  'feature',
  'shell',
  'domain',
  'util',
  'ui',
  'configuration',
  'assets',
  'environments',
];

/**
 * Derives the `type` tag from the lib folder name by matching the leading
 * type prefix (e.g. "data-access-user" → "data-access", "util-navigation" → "util").
 * Falls back to the full name for atypical libs (e.g. "grid-areas").
 */
function deriveType(name: string): string {
  for (const prefix of TYPE_PREFIXES) {
    if (name === prefix || name.startsWith(`${prefix}-`)) {
      return prefix;
    }
  }

  // Fallback: use the full name (e.g. "grid-areas", "imbalance-prices")
  return name;
}

export const createNodesV2: CreateNodesV2 = [
  // Match all libs at the standard 3-level depth: libs/{product}/{domain}/{name}/index.ts
  // Products covered: dh, gf  (watt is excluded — it is a buildable ng-packagr library)
  'libs/{dh,gf}/*/*/index.ts',
  (indexPathList) => {
    return indexPathList
      .filter((indexPath) => {
        const parts = indexPath.split('/');
        // parts: ['libs', '{product}', '{domain}', '{name}', 'index.ts']
        // Exclude paths where the name segment is 'src' — those are internal
        // barrel files, not implicit lib roots (e.g. libs/gf/util-browser/src/index.ts).
        const name = parts[3];
        return name !== 'src';
      })
      .map((indexPath) => {
        const parts = indexPath.split('/');
        // parts: ['libs', '{product}', '{domain}', '{name}', 'index.ts']
        const [libs, product, domain, name] = parts;
        const projectRoot = `${libs}/${product}/${domain}/${name}`;
        const projectName = `${product}-${domain}-${name}`;
        const type = deriveType(name);

        return [
          indexPath,
          {
            projects: {
              [projectRoot]: {
                name: projectName,
                sourceRoot: `${projectRoot}/src`,
                projectType: 'library' as const,
                tags: [`product:${product}`, `domain:${domain}`, `type:${type}`],
                targets: {
                  lint: {
                    command: 'eslint .',
                    options: {
                      cwd: projectRoot,
                    },
                    metadata: { technologies: ['eslint'] },
                    cache: true,
                    inputs: [
                      'default',
                      '^default',
                      '{workspaceRoot}/.eslintrc.json',
                      `{workspaceRoot}/${libs}/${product}/.eslintrc.json`,
                      '{workspaceRoot}/tools/eslint-rules/**/*',
                      {
                        externalDependencies: ['eslint'],
                      },
                    ],
                    outputs: ['{options.outputFile}'],
                  },
                  test: {
                    command: 'vitest',
                    options: {
                      cwd: projectRoot,
                      root: '.',
                    },
                    metadata: { technologies: ['vitest'] },
                    cache: true,
                    inputs: [
                      'default',
                      '^production',
                      {
                        externalDependencies: ['vitest'],
                      },
                      {
                        env: 'CI',
                      },
                    ],
                    outputs: [`{workspaceRoot}/coverage/${libs}/${product}/${domain}/${name}`],
                  },
                },
              },
            },
          },
        ];
      });
  },
];
