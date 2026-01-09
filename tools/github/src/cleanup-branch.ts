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
import { execSync } from 'node:child_process';
import inquirer from 'inquirer';
import dayjs from 'dayjs';

interface BranchInfo {
  name: string;
  date: Date;
}

function getBranches(): BranchInfo[] {
  const output = execSync(
    'git for-each-ref --format="%(refname:short) %(committerdate:iso8601)" refs/heads',
    { encoding: 'utf-8' }
  );

  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [name, ...dateParts] = line.split(' ');
      const dateString = dateParts.join(' ');
      return {
        name,
        date: dayjs(dateString).toDate(),
      };
    })
    .filter(
      (branch) =>
        branch.name !== 'HEAD' &&
        branch.name !== 'main' &&
        branch.date instanceof Date &&
        !isNaN(branch.date.getTime())
    );
}

function deleteBranches(branches: string[]) {
  for (const branch of branches) {
    try {
      execSync(`git branch -D ${branch}`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`Failed to delete branch: ${branch}`);
    }
  }
}

async function main() {
  const branches = getBranches();

  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Choose branch deletion mode:',
      choices: [
        { name: 'Select branches to delete', value: 'interactive' },
        { name: 'Delete all branches older than...', value: 'older' },
      ],
    },
  ]);

  if (mode === 'interactive') {
    const { selected } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Select branches to delete:',
        choices: branches.map((b) => ({
          name: b.name,
          value: b.name,
          short: `${b.name} (last commit: ${dayjs(b.date).format('YYYY-MM-DD')})`,
        })),
        pageSize: 20, // Show more choices at once (default is 10)
      },
    ]);
    deleteBranches(selected);
  } else {
    const { age } = await inquirer.prompt([
      {
        type: 'list',
        name: 'age',
        message: 'Delete branches older than:',
        choices: [
          { name: 'One week', value: '1w' },
          { name: 'Two weeks', value: '2w' },
          { name: 'One month', value: '1m' },
        ],
      },
    ]);

    let cutoff: Date;
    if (age === '1w') cutoff = dayjs().subtract(1, 'week').toDate();
    else if (age === '2w') cutoff = dayjs().subtract(2, 'week').toDate();
    else cutoff = dayjs().subtract(1, 'month').toDate();

    const oldBranches = branches.filter((b) => b.date < cutoff).map((b) => b.name);

    if (oldBranches.length === 0) {
      console.log('No branches found matching the criteria.');
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Delete ${oldBranches.length} branches older than ${dayjs(cutoff).format('YYYY-MM-DD')}?`,
      },
    ]);

    if (confirm) {
      deleteBranches(oldBranches);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
