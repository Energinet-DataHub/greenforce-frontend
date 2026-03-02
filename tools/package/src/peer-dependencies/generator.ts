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
import {
  updateJson,
  readJson,
  readProjectConfiguration,
  Tree,
  createProjectGraphAsync,
} from '@nx/devkit';
import { PeerDependenciesGeneratorSchema } from './schema';

/** Check if file should be scanned for imports */
const isSourceFile = (path: string): boolean =>
  path.endsWith('.ts') &&
  !path.includes('.stories.') &&
  !path.includes('.spec.') &&
  !path.includes('storybook');

/** Extract package name from import path (e.g., "@angular/core/testing" -> "@angular/core") */
const extractPackageName = (importPath: string): string => {
  if (importPath.startsWith('@')) {
    return importPath.split('/').slice(0, 2).join('/');
  }
  return importPath.split('/')[0];
};

/**
 * Find npm dependencies by scanning TypeScript files for import statements.
 * This supplements Nx's project graph which may miss imports with moduleResolution: "bundler".
 */
const findNpmDependenciesUsingGrep = (projectRoot: string, tree: Tree): string[] => {
  const tsFiles: string[] = [];

  const collectTsFiles = (dir: string) => {
    for (const child of tree.children(dir)) {
      const childPath = `${dir}/${child}`;
      if (tree.isFile(childPath) && isSourceFile(childPath)) {
        tsFiles.push(childPath);
      } else if (!tree.isFile(childPath)) {
        collectTsFiles(childPath);
      }
    }
  };

  collectTsFiles(projectRoot);

  const importRegex = /from\s+['"]([^'"./][^'"]*)['"]/g;
  const packages = new Set<string>();

  for (const filePath of tsFiles) {
    const content = tree.read(filePath, 'utf-8');
    if (!content) continue;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const packageName = extractPackageName(match[1]);
      if (!packageName.startsWith('@energinet')) {
        packages.add(packageName);
      }
    }
  }

  return [...packages];
};

export async function peerDependenciesGenerator(
  tree: Tree,
  options: PeerDependenciesGeneratorSchema
) {
  const { dependencies } = readJson(tree, 'package.json');
  const projectGraph = await createProjectGraphAsync();
  const projectDependencies = projectGraph.dependencies[options.project];

  // Get npm dependencies from Nx project graph
  const nxNpmDependencies = projectDependencies
    .filter((d) => d.type === 'static')
    .filter((d) => d.target.startsWith('npm:'))
    .map((d) => d.target)
    .map((t) => t.replace(/^npm:/, '').replace(/@[\d.]+$/, ''));

  // Also scan source files for imports (Nx may miss some with moduleResolution: "bundler")
  const projectConfig = readProjectConfiguration(tree, options.project);
  const grepNpmDependencies = findNpmDependenciesUsingGrep(projectConfig.root, tree);

  // Merge both sources
  const npmDependencies = [...new Set([...nxNpmDependencies, ...grepNpmDependencies])];

  // Fail if no npm dependencies are found
  if (npmDependencies.length === 0) {
    throw Error(`No npm dependencies found for ${options.project}.`);
  }

  // Transform list of dependencies into an object of module name and version
  // Only include packages that exist in the root package.json dependencies
  const peerDependencies = [...new Set(npmDependencies)]
    .filter((k) => dependencies[k])
    .sort()
    .reduce((p, k) => ({ ...p, [k]: `^${dependencies[k]}` }), {});

  // Write the object as `peerDependencies` on the target `package.json` file
  updateJson(tree, options.packageJson, (packageJson) => ({ ...packageJson, peerDependencies }));
}

export default peerDependenciesGenerator;
