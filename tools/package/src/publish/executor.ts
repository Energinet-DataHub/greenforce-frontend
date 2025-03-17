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
import { inc, maxSatisfying } from 'semver';
import { PublishExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<PublishExecutorSchema> = async (options, context) => {
  const cwd = joinPathFragments(context.root, options.path);
  const packageJsonPath = joinPathFragments(cwd, 'package.json');
  const packageJson = readJsonFile(packageJsonPath);
  const { name, version } = packageJson;
  const output = execSync(`npm show ${name} versions --json`);
  const versions: string[] = JSON.parse(output.toString());

  if (versions.includes(packageJson.version)) {
    console.log(`Package "${name}" has already been published with version "${version}"`);
    return { success: true };
  }

  if (options.prerelease) {
    const first = `${version}-alpha.0`;
    const latest = maxSatisfying(versions, `^${first}`);
    const current = latest ? inc(latest, 'prerelease') : first;
    packageJson.version = current;
    writeJsonFile(packageJsonPath, packageJson);
  }

  if (!options.prerelease && !options.force) {
    console.warn(`Publish of package "${name}" skipped due to missing "--force" flag`);
    return { success: false };
  }

  const tag = options.prerelease ? 'alpha' : 'latest';
  execSync(`bun publish --tag ${tag} --access public`, {
    stdio: ['inherit', 'inherit', 'inherit'],
    cwd,
  });

  return { success: true };
};

export default runExecutor;
