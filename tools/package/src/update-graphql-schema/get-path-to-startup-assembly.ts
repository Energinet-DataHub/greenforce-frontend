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
  getPackageManagerCommand,
  joinPathFragments,
  ProjectConfiguration,
  TargetConfiguration,
  workspaceRoot,
} from '@nx/devkit';

import { execSync } from 'child_process';
import { sync } from 'fast-glob';
import { existsSync } from 'fs';
import { basename, relative, resolve } from 'path';

export function buildStartupAssemblyPath(
  projectName: string,
  project: ProjectConfiguration,
  assemblyName: string
) {
  const [target, configuration] = findBuildTarget(project);
  let outputDirectory = configuration?.outputs?.[0];
  if (!outputDirectory) {
    throw new Error(`Specify the output directory for ${project.root}

      To generate swagger with Nx, the outputs must be captured. This is also necessary for Nx's caching mechanism.
      Simply update the outputs array in project.json with the location of your build artifacts.
      `);
  }
  outputDirectory = resolve(
    outputDirectory.replace('{workspaceRoot}', workspaceRoot).replace('{projectRoot}', project.root)
  );
  if (!existsSync(outputDirectory)) {
    execSync(`${getPackageManagerCommand().exec} nx ${target} ${projectName}`, {
      windowsHide: true,
    });
  }
  const dllName = basename(assemblyName) + '.dll';
  const matchingDlls = sync(`**/${dllName}`, { cwd: outputDirectory });
  if (!matchingDlls.length) {
    throw new Error(
      `[nx-dotnet] Unable to locate ${dllName} in ${relative(workspaceRoot, outputDirectory)}`
    );
  }
  if (matchingDlls.length > 1) {
    throw new Error(
      `[nx-dotnet] Located multiple matching dlls for ${projectName}.

You may need to clean old build artifacts from your outputs, or manually
specify the path to the output assembly within ${project.root}/project.json.`
    );
  }
  return joinPathFragments(outputDirectory, matchingDlls[0]);
}

function findBuildTarget(project: ProjectConfiguration): [string, TargetConfiguration] | [] {
  return (
    Object.entries(project?.targets || {}).find(
      ([, x]) => x.executor === '@nx-dotnet/core:build'
    ) ?? []
  );
}
