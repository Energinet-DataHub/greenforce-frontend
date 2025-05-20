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
  joinPathFragments,
  ProjectConfiguration,
  TargetConfiguration,
  TargetDependencyConfig,
  workspaceRoot,
} from '@nx/devkit';

import { basename, resolve } from 'path';

export function buildStartupAssemblyPath(
  project: ProjectConfiguration,
  assemblyName: string,
  dependsOn: (TargetDependencyConfig | string)[] | undefined
) {
  const [, configuration] = findBuildTarget(project, dependsOn);

  let outputDirectory = configuration?.outputs?.[0];

  if (!outputDirectory) {
    throw new Error(`Specify the output directory for ${project.root} in the project.json file.`);
  }
  outputDirectory = resolve(
    outputDirectory.replace('{workspaceRoot}', workspaceRoot).replace('{projectRoot}', project.root)
  );

  const dllName = basename(assemblyName) + '.dll';

  return joinPathFragments(outputDirectory, dllName);
}

function findBuildTarget(
  project: ProjectConfiguration,
  dependsOn: (TargetDependencyConfig | string)[] | undefined
): [string, TargetConfiguration] | [] {
  return (
    Object.entries(project?.targets || {}).find(
      ([target, x]) =>
        (dependsOn?.includes('build') && target === 'build' && x.executor === 'nx:run-commands') ||
        (target === 'serve' && x.executor === 'nx:run-commands')
    ) ?? []
  );
}
