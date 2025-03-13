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
  ExecutorContext,
} from '@nx/devkit';
import { execSync } from 'child_process';
import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { PeerDependenciesExecutorSchema } from './schema';

/**
 * The `createProjectGraphAsync` function currently does not work properly with
 * bun's text-based lockfile, since it does not include external dependencies.
 * This workaround temporarily switches bun to use the binary format while
 * generating the project graph.
 * @see https://github.com/nrwl/nx/issues/30362
 */
const useBunBinaryLockfileWorkaround = async (context: ExecutorContext) => {
  const sampleFile = 'tools/package/src/peer-dependencies/bunfig.toml.sample';
  const bunfig = await readFile(joinPathFragments(context.root, sampleFile), { encoding: 'utf8' });
  const bunfigConfigPath = joinPathFragments(context.root, 'bunfig.toml');
  const bunLockFile = joinPathFragments(context.root, 'bun.lock');
  const bunLockFileIgnore = joinPathFragments(context.root, 'bun.lock.ignore');
  const bunLockBinaryFile = joinPathFragments(context.root, 'bun.lockb');
  await writeFile(bunfigConfigPath, bunfig);
  await rename(bunLockFile, bunLockFileIgnore);
  execSync('bun install --lockfile-only');

  // Revert the temporary workaround
  return async () => {
    await unlink(bunfigConfigPath);
    await unlink(bunLockBinaryFile);
    await rename(bunLockFileIgnore, bunLockFile);
  };
};

const runExecutor: PromiseExecutor<PeerDependenciesExecutorSchema> = async (options, context) => {
  const { dependencies } = readJsonFile(joinPathFragments(context.root, 'package.json'));
  const workaroundCleanup = await useBunBinaryLockfileWorkaround(context); // TEMP
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
  await workaroundCleanup();
  return { success: true };
};

export default runExecutor;
