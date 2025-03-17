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
import { PromiseExecutor, readJsonFile, joinPathFragments, writeJsonFile } from '@nx/devkit';
import { execSync } from 'child_process';
import { eq, gt, inc } from 'semver';
import { BumpVersionExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<BumpVersionExecutorSchema> = async (options, context) => {
  const packageJsonPath = joinPathFragments(context.root, options.packageJson);
  const packageJson = readJsonFile(packageJsonPath);

  execSync('git fetch origin main');
  const packageJsonBuffer = execSync(`git show origin/main:${options.packageJson}`);
  const mainPackageJson = JSON.parse(packageJsonBuffer.toString());
  const latestVersion = mainPackageJson.version;

  // The version has already been updated
  if (!eq(packageJson.version, latestVersion)) {
    // Return successfully if the new version is greater than the latest version
    return { success: gt(packageJson.version, latestVersion) };
  }

  // Increment the patch version
  packageJson.version = inc(latestVersion, 'patch');
  writeJsonFile(packageJsonPath, packageJson, { appendNewLine: true });

  return { success: true };
};

export default runExecutor;
