import {
  ExecutorContext,
  logger,
  ProjectConfiguration,
  PromiseExecutor,
  workspaceRoot,
} from '@nx/devkit';

import { dirname, resolve } from 'path';

import { DotNetClient, dotnetFactory } from '@nx-dotnet/dotnet';
import { getExecutedProjectConfiguration, getProjectFileForNxProject } from '@nx-dotnet/utils';

import { buildStartupAssemblyPath } from './get-path-to-startup-assembly';
import { UpdateGraphqlSchemaExecutorSchema } from './schema';
import { existsSync, mkdirSync, watchFile } from 'fs';
import { spawn } from 'child_process';

export const SWAGGER_CLI_TOOL = 'Swashbuckle.AspNetCore.Cli';

function normalizeOptions(
  opts: Partial<UpdateGraphqlSchemaExecutorSchema>,
  project: ProjectConfiguration,
  csProjFilePath: string,
  projectName: string
): UpdateGraphqlSchemaExecutorSchema {
  return {
    output: resolve(workspaceRoot, opts.output ?? `dist/graphql/${project.root}/schema.graphql`),
    startupAssembly: opts.startupAssembly
      ? resolve(workspaceRoot, opts.startupAssembly)
      : resolve(buildStartupAssemblyPath(projectName, project, csProjFilePath)),
  };
}

const runExecutor: PromiseExecutor<UpdateGraphqlSchemaExecutorSchema> = async (
  schema: Partial<UpdateGraphqlSchemaExecutorSchema>,
  context: ExecutorContext,
  dotnetClient: DotNetClient = new DotNetClient(dotnetFactory(), workspaceRoot)
): Promise<{ success: boolean }> => {
  const nxProjectConfiguration = getExecutedProjectConfiguration(context);
  console.log(
    `Running update-graphql-schema for project: ${context.projectName} in workspace: ${workspaceRoot}`
  );
  const csProjFilePath = await getProjectFileForNxProject(nxProjectConfiguration);
  console.log(`Using project file: ${csProjFilePath}`);
  const projectDirectory = resolve(workspaceRoot, nxProjectConfiguration.root);
  dotnetClient.cwd = projectDirectory;
  const options = normalizeOptions(
    schema,
    nxProjectConfiguration,
    csProjFilePath,
    context.projectName as string
  );

  const outputDirectory = dirname(options.output);
  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory, { recursive: true });
  }

  watchFile(options.startupAssembly, { persistent: true, interval: 1000 }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      logger.info(`File changed: ${options.startupAssembly}`);
    }
  });

  return new Promise((resolve, reject) => {
    const childProcess = spawn(
      'dotnet',
      ['exec', `${options.startupAssembly}`, `schema`, `export`, `--output=${options.output}`],
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
      } else {
        reject({
          success: false,
          error: new Error('OpenAPI generator failed'),
        });
      }
    });
  });
};

export default runExecutor;
