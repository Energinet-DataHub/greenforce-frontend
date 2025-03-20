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
import { Tree, readJson, updateJson } from '@nx/devkit';
import { execSync } from 'child_process';
import { eq, lt, inc } from 'semver';
import { VersionBumpGeneratorSchema } from './schema';

export async function versionBumpGenerator(tree: Tree, options: VersionBumpGeneratorSchema) {
  const packageJson = readJson(tree, options.packageJson);
  execSync('git fetch origin main');
  const packageJsonBuffer = execSync(`git show origin/main:${options.packageJson}`);
  const mainPackageJson = JSON.parse(packageJsonBuffer.toString());
  const latestVersion = mainPackageJson.version;

  // Only allow incrementing versions
  if (lt(packageJson.version, latestVersion)) {
    throw Error(`Version for ${packageJson.name} is lower than the latest version `);
  }

  // The version has already been bumped correctly
  if (!eq(packageJson.version, latestVersion)) return;

  // Increment the patch version
  updateJson(tree, options.packageJson, (packageJson) => {
    packageJson.version = inc(latestVersion, 'patch');
    return packageJson;
  });
}

export default versionBumpGenerator;
