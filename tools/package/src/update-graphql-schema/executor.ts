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
import { ExecutorContext, logger, PromiseExecutor, workspaceRoot } from '@nx/devkit';

import { dirname, resolve } from 'path';

import { getExecutedProjectConfiguration, getProjectFileForNxProject } from '@nx-dotnet/utils';

import { UpdateGraphqlSchemaExecutorSchema } from './schema';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { watch } from 'node:fs/promises';
import { spawn } from 'child_process';
import xml2js from 'xml2js';
import { buildStartupAssemblyPath } from './get-path-to-startup-assembly';

const runExecutor: PromiseExecutor<UpdateGraphqlSchemaExecutorSchema> = async (
  schema: Partial<UpdateGraphqlSchemaExecutorSchema>,
  context: ExecutorContext
): Promise<{ success: boolean }> => {
  const nxProjectConfiguration = getExecutedProjectConfiguration(context);
  const csProjFilePath = await getProjectFileForNxProject(nxProjectConfiguration);

  // Extract assembly name from the csproj file
  const assemblyName = getAssemblyName(csProjFilePath, context.projectName);

  console.log(`Assembly name: ${assemblyName}`);

  if (!assemblyName) {
    throw new Error(
      `Assembly name could not be determined for project ${context.projectName}. Please ensure the csproj file has an AssemblyName property.`
    );
  }

  const startupAssembly = buildStartupAssemblyPath(nxProjectConfiguration, assemblyName);

  console.log(`Startup assembly: ${startupAssembly}`);

  const output = resolve(
    workspaceRoot,
    schema.output ?? `dist/graphql/${nxProjectConfiguration.root}/schema.graphql`
  );

  const outputDirectory = dirname(output);
  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory, { recursive: true });
  }

  if (schema.watch) {
    await watchForChanges(startupAssembly, output);
  }

  return updateGraphqlSchema(startupAssembly, output);
};

async function watchForChanges(startupAssembly: string, output: string) {
  console.log(`Watching for changes in ${startupAssembly}...`);
  const watcher = watch(startupAssembly);

  for await (const event of watcher) {
    if (event.eventType === 'rename') {
      console.log(`File renamed or deleted: ${startupAssembly}. Re-initializing watcher...`);
      await watchForChanges(startupAssembly, output);
    }

    if (event.eventType === 'change') {
      console.log(`Change detected in ${startupAssembly}. Updating GraphQL schema...`);
      await updateGraphqlSchema(startupAssembly, output);
    }
  }
}

function updateGraphqlSchema(
  startupAssembly: string,
  output: string
): { success: boolean } | PromiseLike<{ success: boolean }> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(
      'dotnet',
      ['exec', `${startupAssembly}`, `schema`, `export`, `--output=${output}`],
      { shell: true, stdio: 'inherit', windowsHide: true }
    );

    childProcess.on('error', (error) => {
      logger.error(error);
      reject({
        success: false,
        error,
      });
    });

    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve({
          success: true,
        });
        console.log(`GraphQL schema exported to ${output}`);
      } else {
        reject({
          success: false,
          error: new Error('OpenAPI generator failed'),
        });
      }
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAssemblyNameFromXml(result: any): string | undefined {
  if (!result.Project || !result.Project.PropertyGroup) {
    return undefined;
  }

  // Look for AssemblyName in all PropertyGroup elements
  for (const propertyGroup of result.Project.PropertyGroup) {
    if (propertyGroup.AssemblyName && propertyGroup.AssemblyName.length > 0) {
      return propertyGroup.AssemblyName[0];
    }
  }
  return undefined;
}

function getAssemblyName(csProjFilePath: string, defaultName: string | undefined) {
  try {
    const csprojContent = readFileSync(csProjFilePath, 'utf8');
    const parser = new xml2js.Parser();
    let assemblyName = defaultName;

    parser.parseString(csprojContent, (err, result) => {
      if (!err) {
        const extracted = extractAssemblyNameFromXml(result);
        if (extracted) {
          assemblyName = extracted;
        }
      }
    });

    return assemblyName;
  } catch (error) {
    logger.warn(`Failed to extract AssemblyName from csproj file: ${error.message}`);
    logger.info('Using project name as fallback for AssemblyName');
    return defaultName;
  }
}

export default runExecutor;
