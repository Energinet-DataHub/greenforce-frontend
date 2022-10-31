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
import 'dotenv/config';
import { join } from 'path';
import {
  ExecutorContext,
  logger,
  parseTargetString,
  readTargetOptions,
  runExecutor,
} from '@nrwl/devkit';
import { default as runCommandsExecutor } from 'nx/src/executors/run-commands/run-commands.impl';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = { [k: string]: any };

export interface PlaywrightExecutorOptions extends Json {
  playwrightConfig: string;
  watch?: boolean;
  tsConfig?: string;
  devServerTarget?: string;
  headed?: boolean;
  headless?: boolean;
  include?: string;
  exclude?: string;
}

export default async function playwrightExecutor(
  options: PlaywrightExecutorOptions,
  context: ExecutorContext
) {
  options = normalizeOptions(options, context);

  let success;
  for await (const baseUrl of startDevServer(options, context)) {
    try {
      success = await runPlaywright(baseUrl, options, context);
      if (!options.watch) break;
    } catch (e) {
      logger.error(e.message);
      success = false;
      if (!options.watch) break;
    }
  }

  return { success };
}

function normalizeOptions(
  options: PlaywrightExecutorOptions,
  context: ExecutorContext
) {
  options.env = options.env || {};
  if (options.tsConfig) {
    const tsConfigPath = join(context.root, options.tsConfig);
    options.env.tsConfig = tsConfigPath;
    process.env.TS_NODE_PROJECT = tsConfigPath;
  }
  return options;
}

async function* startDevServer(
  opts: PlaywrightExecutorOptions,
  context: ExecutorContext
) {
  // no dev server, return the provisioned base url
  if (!opts.devServerTarget || opts.skipServe) {
    yield opts.baseUrl;
    return;
  }

  const { project, target, configuration } = parseTargetString(
    opts.devServerTarget
  );
  const devServerTargetOpts = readTargetOptions(
    { project, target, configuration },
    context
  );
  const targetSupportsWatchOpt =
    Object.keys(devServerTargetOpts).includes('watch');

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
  }>(
    { project, target, configuration },
    // @NOTE: Do not forward watch option if not supported by the target dev server,
    // this is relevant for running Playwright against dev server target that does not support this option,
    // for instance @nguniversal/builders:ssr-dev-server.
    targetSupportsWatchOpt ? { watch: opts.watch } : {},
    context
  )) {
    if (!output.success && !opts.watch)
      throw new Error('Could not compile application files');
    yield opts.baseUrl || (output.baseUrl as string);
  }
}

async function runPlaywright(
  baseUrl: string,
  opts: PlaywrightExecutorOptions,
  context
) {
  const projectname = context.projectName;
  const sourceRoot = context.workspace.projects[projectname].sourceRoot;

  let playwrightCommand = `playwright test ${sourceRoot} --config=${opts.playwrightConfig}`;
  if (opts.include) {
    playwrightCommand += ` --grep="${escapeRegExp(opts.include)}"`;
  }
  if (opts.exclude) {
    playwrightCommand += ` --grep-invert="${escapeRegExp(opts.exclude)}"`;
  }
  if (opts.debug) {
    process.env.PWDEBUG = '1';
    playwrightCommand += ` --workers=1`;
  }

  process.env.BASE_URL = baseUrl;

  const { success } = await runCommandsExecutor(
    {
      commands: [playwrightCommand],
      parallel: true,
      __unparsed__: [],
    },
    context
  );

  return success;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
