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
  // createProjectGraphAsync,
  updateJson,
  readJson,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import type { ICruiseResult } from 'dependency-cruiser';
import { execSync } from 'child_process';
import { PeerDependenciesGeneratorSchema } from './schema';

// dependency-cruiser also has an API, but it is ESM only which Nx fails to import...
const findNpmDependenciesUsingDependencyCruiser = (path: string): string[] => {
  const buffer = execSync(
    `bun depcruise \
      ${path} \
      --do-not-follow "^node_modules" \
      --exclude "(storybook|.spec.ts$|.stories.ts$)" \
      --output-type json \
      --no-config`
  );

  const output: ICruiseResult = JSON.parse(buffer.toString());
  return output.modules
    .flatMap((m) => m.dependencies)
    .filter((d) => d.dependencyTypes?.some((d) => d.startsWith('npm')))
    .map((d) => d.module)
    .map((d) => (d.startsWith('@') ? d.split('/').slice(0, 2).join('/') : d.split('/')[0]));
};

export async function peerDependenciesGenerator(
  tree: Tree,
  options: PeerDependenciesGeneratorSchema
) {
  const { dependencies } = readJson(tree, 'package.json');
  // const projectGraph = await createProjectGraphAsync();
  // const projectDependencies = projectGraph.dependencies[options.project];
  // const npmDependencies = projectDependencies
  //   .filter((d) => d.type === 'static')
  //   .filter((d) => d.target.startsWith('npm:'))
  //   .map((d) => d.target)
  //   .map((t) => t.split(':')[1]);

  // Use "dependency-cruiser" until Nx fixes their project graph
  const path = readProjectConfiguration(tree, options.project);
  const npmDependencies = findNpmDependenciesUsingDependencyCruiser(path.root);

  // Fail if no npm dependencies are found
  if (npmDependencies.length == 0) {
    throw Error(`ProjectGraph for ${options.project} unexpectedly contains no npm dependencies.`);
  }

  // Transform list of dependencies into an object of module name and version
  const peerDependencies = npmDependencies
    .filter((k) => dependencies[k])
    .sort()
    .reduce((p, k) => ({ ...p, [k]: `^${dependencies[k]}` }), {});

  // Write the object as `peerDependencies` on the target `package.json` file
  updateJson(tree, options.packageJson, (packageJson) => ({ ...packageJson, peerDependencies }));
}

export default peerDependenciesGenerator;
