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

type answers = { type: string; title: string };

const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'type',
    message: 'Choose type:',
    choices: ['feature', 'bugfix', 'chore', 'refactor', 'test'],
  },
  {
    type: 'input',
    name: 'title',
    message: 'Title of the branch:',
  },
]);

const { type, title } = answers;

const branch = `${type}/${title
  .toLowerCase()
  .replace(/[\W_]+/g, '-')
  .substring(0, 63)}`;

const createResponse = await execAsync(`git checkout -b ${branch}`);

console.log(createResponse);

console.log(`Created ${branch}`);
