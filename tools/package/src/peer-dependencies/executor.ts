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
  PromiseExecutor,
  createProjectGraphAsync,
  readJsonFile,
  joinPathFragments,
  writeJsonFile,
} from '@nx/devkit';
import { PeerDependenciesExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<PeerDependenciesExecutorSchema> = async (options, context) => {
  const { dependencies } = readJsonFile(joinPathFragments(context.root, 'package.json'));
  const projectGraph = await createProjectGraphAsync();
  const peerDependencies = projectGraph.dependencies[options.project]
    .filter((d) => d.type === 'static')
    .filter((d) => d.target.startsWith('npm:'))
    .map((d) => d.target)
    .map((t) => t.split(':')[1])
    .filter((k) => dependencies[k])
    .sort()
    .reduce((p, k) => ({ ...p, [k]: `^${dependencies[k]}` }), {});

  const packageJsonPath = joinPathFragments(context.root, options.packageJson);
  const packageJson = readJsonFile(packageJsonPath);
  packageJson.peerDependencies = peerDependencies;
  writeJsonFile(packageJsonPath, packageJson);

  return { success: true };
};

export default runExecutor;
