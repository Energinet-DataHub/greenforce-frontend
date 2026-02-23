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
import { CreateNodesV2, CreateNodesResultV2, TargetConfiguration } from '@nx/devkit';

/**
 * Implicit Libraries Plugin
 *
 * This plugin automatically infers Nx projects from the folder structure,
 * eliminating the need for individual project.json files in each library.
 *
 * Supported patterns:
 * - libs/{product}/{domain}/{name}/index.ts (e.g., libs/dh/admin/feature-user-management)
 * - libs/{product}/{name}/index.ts (e.g., libs/dh/grid-areas, libs/gf/test-util)
 * - libs/{product}/{category}/{domain}/{name}/index.ts (e.g., libs/gf/msw/util-msw)
 */

interface LibraryInfo {
  projectRoot: string;
  projectName: string;
  product: string;
  domain: string | null;
  type: string;
  tags: string[];
}

/**
 * Parse library path to extract project information
 */
function parseLibraryPath(indexPath: string): LibraryInfo | null {
  const parts = indexPath.split('/');

  // Skip if this is inside a src/ or lib/ directory (these are not library roots)
  if (parts.includes('src') || parts.includes('lib')) {
    return null;
  }

  // Remove 'libs' prefix and 'index.ts' suffix
  const pathParts = parts.slice(1, -1);

  if (pathParts.length < 2) {
    return null;
  }

  const product = pathParts[0]; // dh, gf

  // Exclude watt - it's a buildable library that should remain explicit
  if (product === 'watt') {
    return null;
  }

  let projectName: string;
  let domain: string | null;
  let projectRoot: string;

  if (pathParts.length === 2) {
    // Pattern: libs/{product}/{name} (e.g., libs/dh/grid-areas, libs/gf/test-util)
    const name = pathParts[1];
    projectName = `${product}-${name}`;
    domain = null;
    projectRoot = `libs/${product}/${name}`;
  } else if (pathParts.length === 3) {
    // Pattern: libs/{product}/{domain}/{name} (e.g., libs/dh/admin/feature-user-management)
    domain = pathParts[1];
    const name = pathParts[2];
    projectName = `${product}-${domain}-${name}`;
    projectRoot = `libs/${product}/${domain}/${name}`;
  } else if (pathParts.length === 4) {
    // Pattern: libs/{product}/{category}/{domain}/{name} (e.g., libs/gf/msw/util-msw)
    // Treat category-domain as combined domain
    domain = `${pathParts[1]}-${pathParts[2]}`;
    const name = pathParts[3];
    projectName = `${product}-${pathParts[1]}-${name}`;
    projectRoot = `libs/${product}/${pathParts[1]}/${pathParts[2]}/${name}`;
  } else {
    return null;
  }

  // Extract type from name (last segment after hyphen)
  // e.g., feature-user-management -> feature, data-access-api -> data-access
  const libraryName = pathParts[pathParts.length - 1] || '';
  const nameParts = libraryName.split('-');
  let type: string;

  // Valid types in this workspace (from .eslintrc.json module boundaries)
  const validTypes = [
    'app',
    'api',
    'e2e',
    'feature',
    'ui',
    'data-access',
    'util',
    'test-util',
    'e2e-util',
    'shell',
    'domain',
    'configuration',
    'environments',
    'assets',
    'styles',
  ];

  // Handle compound types like data-access, test-util, e2e-util
  const compoundTypes = ['data-access', 'test-util', 'e2e-util', 'util'];
  const firstTwo = nameParts.slice(0, 2).join('-');
  if (compoundTypes.includes(firstTwo)) {
    type = firstTwo;
  } else {
    type = nameParts[0] || 'lib';
  }

  // Map specific library names/types to correct tag types
  // Some libraries have names that don't directly correspond to their type tag
  const typeMapping: Record<string, string> = {
    routing: 'configuration',
    shared: 'domain',
    release: 'configuration', // release-toggle -> configuration
  };

  // Also check if the full library name starts with known types
  const fullNameTypePatterns: [RegExp, string][] = [
    [/^assets-/, 'assets'],
    [/^configuration-/, 'configuration'],
    [/^environments?$/, 'environments'],
  ];

  // Apply full name patterns first
  for (const [pattern, mappedType] of fullNameTypePatterns) {
    if (pattern.test(libraryName)) {
      type = mappedType;
      break;
    }
  }

  // Then apply type mapping
  if (typeMapping[type]) {
    type = typeMapping[type];
  }

  // If type is still not valid, default to 'feature' for top-level libraries
  // These are typically standalone feature modules (e.g., grid-areas, imbalance-prices)
  if (!validTypes.includes(type) && pathParts.length === 2) {
    type = 'feature';
  }

  // Build tags
  const tags = [`product:${product}`, `type:${type}`];
  if (domain) {
    tags.push(`domain:${domain}`);
  }

  return {
    projectRoot,
    projectName,
    product,
    domain,
    type,
    tags,
  };
}

/**
 * Get prefix for Angular selectors based on product
 */
function getPrefix(product: string): string {
  return product; // dh -> dh, gf -> gf
}

/**
 * Create lint target configuration using command approach
 */
function createLintTarget(projectRoot: string, product: string): TargetConfiguration {
  return {
    command: 'eslint .',
    options: {
      cwd: projectRoot,
    },
    cache: true,
    inputs: [
      'default',
      '^default',
      '{workspaceRoot}/.eslintrc.json',
      `{workspaceRoot}/libs/${product}/.eslintrc.json`,
      '{workspaceRoot}/tools/eslint-rules/**/*',
      { externalDependencies: ['eslint'] },
    ],
    outputs: ['{options.outputFile}'],
    metadata: { technologies: ['eslint'] },
  };
}

/**
 * Create test target configuration using command approach
 * This avoids needing tsconfig.json in each library
 */
function createTestTarget(projectRoot: string, product: string): TargetConfiguration {
  return {
    command: 'vitest',
    options: {
      cwd: projectRoot,
      root: '.',
    },
    cache: true,
    inputs: ['default', '^production', { externalDependencies: ['vitest'] }, { env: 'CI' }],
    outputs: [`{workspaceRoot}/coverage/${projectRoot}`],
    metadata: { technologies: ['vitest'] },
  };
}

export const createNodesV2: CreateNodesV2 = [
  'libs/**/index.ts',
  (indexPathList): CreateNodesResultV2 => {
    return indexPathList
      .map((indexPath): [string, { projects: Record<string, object> }] | null => {
        const libraryInfo = parseLibraryPath(indexPath);

        if (!libraryInfo) {
          return null;
        }

        const { projectRoot, projectName, product, tags } = libraryInfo;

        return [
          indexPath,
          {
            projects: {
              [projectRoot]: {
                name: projectName,
                sourceRoot: projectRoot,
                projectType: 'library',
                prefix: getPrefix(product),
                tags,
                targets: {
                  lint: createLintTarget(projectRoot, product),
                  test: createTestTarget(projectRoot, product),
                },
              },
            },
          },
        ];
      })
      .filter(
        (result): result is [string, { projects: Record<string, object> }] => result !== null
      );
  },
];
