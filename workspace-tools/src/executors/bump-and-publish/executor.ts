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
import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import fs from 'fs';

interface Options {
  packageJson: string;
}

export default async function runExecutor(options: Options, context: ExecutorContext) {
  let branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();

  // Replace special characters in the branch name with a hyphen
  branchName = branchName.replace(/[^a-zA-Z0-9]/g, '-');

  let versionSuffix = branchName === 'main' ? gitCommitHash : `${branchName}.${Date.now()}`;

  // Truncate the version suffix to ensure the version number doesn't exceed the npm limit
  const maxVersionLength = 256;
  const versionPrefixLength = '1.0.0-'.length;
  if (versionSuffix.length > maxVersionLength - versionPrefixLength) {
    versionSuffix = versionSuffix.substring(0, maxVersionLength - versionPrefixLength);
  }

  const locationOfPackageJson = join(context.root, options.packageJson);

  // Change the current working directory to the package.json directory
  process.chdir(join(locationOfPackageJson, '..'));

  // Bump the package version
  console.log(`\n\n⬆️  Bumped package version to: \n\n`);
  execSync(`npm version "1.0.0-${versionSuffix}" --no-git-tag-version`, { stdio: 'inherit' });

  // Replace peer-dependency versions with the package.json from the workspace root
  console.log(`\n\n🔧 Updating peer-dependencies in package...\n`);

  const workspacePackageJson = JSON.parse(readFileSync(join(context.root, 'package.json'), 'utf-8'));
  const workspaceDependencies = workspacePackageJson.dependencies;
  const packageJsonContent = JSON.parse(readFileSync(locationOfPackageJson, 'utf-8'));
  const missingWorkspaceDependencies: string[] = [];

  Object.keys(packageJsonContent.peerDependencies).forEach((dependency: string) => {
    if (workspaceDependencies[dependency]) {
      console.log('Updated peer dependency:', dependency, 'to', workspaceDependencies[dependency]);
      packageJsonContent.peerDependencies[dependency] = workspaceDependencies[dependency];
    } else {
      missingWorkspaceDependencies.push(dependency);
    }
  });

  if(missingWorkspaceDependencies.length > 0) {
    console.error(
      `\n\n❌ Package.json has a peer dependency, which is not part of the workspace dependencies.\n`
    );
    missingWorkspaceDependencies.forEach((dependency) => {
      console.error(`${dependency}: ${packageJsonContent.peerDependencies[dependency]}`);
    });
    return { success: false };
  }

  fs.writeFileSync(locationOfPackageJson, JSON.stringify(packageJsonContent, null, 2));

  // Write the .npmrc file with the GitHub token
  console.log(`\n\n🔑 Writing .npmrc file...\n\n`);
  const npmrcContent = `//npm.pkg.github.com/:_authToken=${process.env.GITHUB_TOKEN}\nregistry=https://npm.pkg.github.com/Energinet-DataHub\n`;
  fs.writeFileSync('.npmrc', npmrcContent);

  try {
    execSync('npm publish', { stdio: 'inherit' });
  } catch (error) {
    console.error(
      '\n\n❌ Failed to publish the package. The package version may already exist.\n\n'
    );
    return { success: false };
  }

  // Read the package.json file to get the package name
  const packageJson = JSON.parse(readFileSync(locationOfPackageJson, 'utf-8'));
  const packageName = packageJson.name;
  const packageVersion = packageJson.version;

  console.log(`\n\n📦 Published package: ${packageName}@${packageVersion}\n\n`);

  return { success: true };
}
