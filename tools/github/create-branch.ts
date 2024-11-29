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
    choices: ['feature', 'bugfix', 'chore', 'refactor', 'test', 'experiment'],
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
