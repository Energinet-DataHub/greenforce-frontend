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
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

const execAsync = promisify(exec);

const REPO = 'Energinet-DataHub/dh3-dev-secrets';
const BASE_PATH = 'greenforce-frontend';
const ENV_PATTERN = /^(dev_\d+|test_\d+|prod_\d+)$/;

interface GitTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  url: string;
}

interface GitTreeResponse {
  sha: string;
  url: string;
  tree: GitTreeItem[];
  truncated: boolean;
}

interface ConfigFile {
  environment: string;
  sourcePath: string;
  targetPath: string;
  sha: string;
}

async function fetchRepoTree(): Promise<GitTreeItem[]> {
  console.log('📡 Fetching repository structure...');

  const { stdout } = await execAsync(`gh api repos/${REPO}/git/trees/main?recursive=1`);

  const response: GitTreeResponse = JSON.parse(stdout);

  if (response.truncated) {
    console.warn('⚠️  Warning: Repository tree was truncated. Some files may be missing.');
  }

  return response.tree;
}

function discoverEnvironmentsAndFiles(tree: GitTreeItem[]): {
  environments: string[];
  files: ConfigFile[];
} {
  const environments = new Set<string>();
  const files: ConfigFile[] = [];

  for (const item of tree) {
    // Only process files within greenforce-frontend
    if (!item.path.startsWith(BASE_PATH + '/') || item.type !== 'blob') {
      continue;
    }

    // Get path relative to greenforce-frontend
    const relativePath = item.path.slice(BASE_PATH.length + 1);
    const pathParts = relativePath.split('/');

    // Find environment directory in path
    const envIndex = pathParts.findIndex((part) => ENV_PATTERN.test(part));
    if (envIndex === -1) {
      continue;
    }

    const environment = pathParts[envIndex];

    // Build target path by removing the environment directory from the path
    const targetParts = [...pathParts.slice(0, envIndex), ...pathParts.slice(envIndex + 1)];
    const targetPath = targetParts.join('/');

    environments.add(environment);
    files.push({
      environment,
      sourcePath: item.path,
      targetPath,
      sha: item.sha,
    });
  }

  return {
    environments: Array.from(environments).sort(),
    files,
  };
}

async function fetchFileContent(sha: string): Promise<string> {
  const { stdout } = await execAsync(`gh api repos/${REPO}/git/blobs/${sha} --jq '.content'`);

  // GitHub returns base64 encoded content
  return Buffer.from(stdout.trim(), 'base64').toString('utf-8');
}

async function writeConfigFile(targetPath: string, content: string): Promise<void> {
  // Ensure directory exists
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, content, 'utf-8');
}

async function main() {
  try {
    // Fetch the repository tree
    const tree = await fetchRepoTree();

    // Discover environments and config files
    const { environments, files } = discoverEnvironmentsAndFiles(tree);

    if (environments.length === 0) {
      console.error('❌ No environments found in the repository.');
      process.exit(1);
    }

    console.log(
      `\n🔍 Found ${environments.length} environment(s) with ${files.length} config file(s)\n`
    );

    // Prompt user to select environment
    const { selectedEnv } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedEnv',
        message: 'Select environment:',
        choices: environments,
      },
    ]);

    // Filter files for selected environment
    const envFiles = files.filter((f) => f.environment === selectedEnv);

    console.log(`\n📦 Switching to ${selectedEnv}...\n`);

    // Fetch and write each file
    for (const file of envFiles) {
      console.log(`  ⬇️  Fetching ${file.sourcePath}`);
      const content = await fetchFileContent(file.sha);

      console.log(`  📝 Writing ${file.targetPath}`);
      await writeConfigFile(file.targetPath, content);
    }

    console.log(`\n✅ Successfully switched to ${selectedEnv}!`);
    console.log(`\n📋 Updated files:`);
    for (const file of envFiles) {
      console.log(`   - ${file.targetPath}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('gh: command not found') ||
        error.message.includes('not recognized')
      ) {
        console.error(
          '❌ GitHub CLI (gh) is not installed. Please install it: https://cli.github.com/'
        );
      } else if (error.message.includes('gh auth')) {
        console.error('❌ Not authenticated with GitHub CLI. Run: gh auth login');
      } else {
        console.error(`❌ Error: ${error.message}`);
      }
    } else {
      console.error('❌ An unexpected error occurred:', error);
    }
    process.exit(1);
  }
}

main();
