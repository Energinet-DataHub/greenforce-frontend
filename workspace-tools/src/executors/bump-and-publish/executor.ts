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
  const locationOfPackageJson = join(context.root, options.packageJson);

  // Bump the package version
  bumpPackageVersion(locationOfPackageJson, generatePakacgeVersion());

  // Replace peer-dependency versions with the package.json from the workspace root
  const updatingPeerDependencies = updatePeerDependencies(locationOfPackageJson, context.root);
  if (!updatingPeerDependencies.success) {
    return { success: false };
  }

  // Write the .npmrc file with the GitHub token
  authenticate();

  // Publish the package to the GitHub package registry
  const publising = publish(locationOfPackageJson);
  if (!publising.success) {
    return { success: false };
  }

  return { success: true };
}

function generatePakacgeVersion(): string {
  let branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();

  // Replace special characters in the branch name with a hyphen
  branchName = branchName.replace(/[^a-zA-Z0-9]/g, '-');

  let versionSuffix = branchName === 'main' ? gitCommitHash : `${branchName}.${Date.now()}`;
  const version = branchName === 'main' ? '1.0.0' : '0.0.0';

  // Truncate the version suffix to ensure the version number doesn't exceed the npm limit
  const maxVersionLength = 255;
  const versionPrefixLength = version.length;
  if (versionSuffix.length > maxVersionLength - versionPrefixLength) {
    versionSuffix = versionSuffix.substring(0, maxVersionLength - versionPrefixLength);
  }

  return `${version}-${versionSuffix}`;
}

function bumpPackageVersion(locationOfPackageJson: string, version: string) {
  // Change the current working directory to the package.json directory
  process.chdir(join(locationOfPackageJson, '..'));

  console.log(`\n\n⬆️  Bumped package version to: \n\n`);
  execSync(`npm version "${version}" --no-git-tag-version`, { stdio: 'inherit' });
}

function updatePeerDependencies(
  locationOfPackageJson: string,
  workspaceRoot: string
): { success: boolean } {
  console.log(`\n\n🔧 Updating peer-dependencies in package...\n`);

  const workspacePackageJson = JSON.parse(
    readFileSync(join(workspaceRoot, 'package.json'), 'utf-8')
  );
  const workspaceDependencies = workspacePackageJson.dependencies;
  const packageJsonContent = JSON.parse(readFileSync(locationOfPackageJson, 'utf-8'));
  const missingWorkspaceDependencies: string[] = [];

  Object.keys(packageJsonContent.peerDependencies).forEach((dependency: string) => {
    if (workspaceDependencies[dependency]) {
      const version = `^${workspaceDependencies[dependency]}`;
      packageJsonContent.peerDependencies[dependency] = `${version}`;

      console.log(`Updated peer dependency: ${dependency} to ${version}`);
    } else {
      missingWorkspaceDependencies.push(dependency);
    }
  });

  if (missingWorkspaceDependencies.length > 0) {
    console.error(
      `\n\n❌ Package.json has a peer dependency, which is not part of the workspace dependencies.\n`
    );
    missingWorkspaceDependencies.forEach((dependency) => {
      console.error(`${dependency}: ${packageJsonContent.peerDependencies[dependency]}`);
    });
    return { success: false };
  }

  fs.writeFileSync(locationOfPackageJson, JSON.stringify(packageJsonContent, null, 2));
  return { success: true };
}

function authenticate() {
  console.log(`\n\n🔑 Writing .npmrc file...\n\n`);
  const npmrcContent = `//npm.pkg.github.com/:_authToken=${process.env.GITHUB_TOKEN}\nregistry=https://npm.pkg.github.com/Energinet-DataHub\n`;
  fs.writeFileSync('.npmrc', npmrcContent);
}

function publish(locationOfPackageJson: string): { success: boolean } {
  try {
    execSync('npm publish', { stdio: 'inherit' });
  } catch (error) {
    console.error(
      '\n\n❌ Failed to publish the package. The package version may already exist.\n\n'
    );
    return { success: false };
  }

  // Read the package.json file to get the package name
  const { name, version } = getPackageNameAndVersion(locationOfPackageJson);
  console.log(`\n\n📦 Published package: ${name}@${version}\n\n`);

  return { success: true };
}

function getPackageNameAndVersion(path: string) {
  const { name, version } = JSON.parse(readFileSync(path, 'utf-8'));
  return { name, version };
}
