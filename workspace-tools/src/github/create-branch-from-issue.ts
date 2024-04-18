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
import inquirer from 'inquirer';
import { ExecException, exec } from 'child_process';

const execAsync = (command: string) => {
  return new Promise<string>((resolve, reject: (err: ExecException) => void) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      }

      resolve(stdout);
    });
  });
};

type issue = {
  title: string;
  number: string;
};

type answers = { team: string; type: string; issue: string };

const teams = [
  {
    team: 'Raccoons',
    repo: 'Energinet-DataHub/team-raccoons',
  },
  {
    team: 'Mandalorian',
    repo: 'Energinet-DataHub/opengeh-wholesale',
  },
  {
    team: 'Mosaic',
    repo: 'Energinet-DataHub/team-phoenix',
  },
  {
    team: 'Bounty hunters',
    repo: 'Energinet-DataHub/greenforce-frontend',
  },
];

const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'team',
    message: 'Choose team:',
    choices: teams.map((team) => team.team),
  },
  {
    type: 'list',
    name: 'type',
    message: 'Choose type:',
    choices: ['feature', 'bugfix', 'chore', 'refactor', 'test'],
  },
  {
    type: 'input',
    name: 'issue',
    message: 'Type issue number or select from list',
  },
]);

const selectedRepo = teams.find((team) => team.team === answers.team)?.repo as string;
let { issue }: { issue: string } = answers;
const { type } = answers;

const issues = JSON.parse(
  await execAsync(`gh issue list --repo ${selectedRepo} --limit 1000 --json title,number`)
) as issue[];

if (issue === '') {
  const { choosenissue } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choosenissue',
      message: 'Choose issue:',
      choices: issues.map((issue) => `${issue.number}: ${issue.title}`),
    },
  ]);

  issue = choosenissue.split(':')[0].trim() as string;
}

const issueTitle = issues
  .find(({ number }) => number.toString() === issue)
  ?.title.trim()
  .toLowerCase()
  .replace(/[\W_]+/g, '-')
  .substring(0, 63);

if (issueTitle) {
  const createResponse = await execAsync(
    `gh issue develop ${issue} --repo ${selectedRepo} --name ${type}/${issueTitle} --branch-repo=Energinet-Datahub/greenforce-frontend --checkout`
  );

  console.log(
    `Created, and checkout ${createResponse.replace(
      'github.com/Energinet-DataHub/greenforce-frontend/tree/',
      ''
    )}`
  );
} else {
  console.log('No issue found');
}
