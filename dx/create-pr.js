#!/usr/bin/env node

import { exec } from 'child_process';
import inquirer from 'inquirer';

exec(`git branch`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'branch',
        message: 'Make PR to:',
        choices: [
          'main',
          new inquirer.Separator(),
          ...stdout
            .split('\n')
            .map((branch) => branch.trim())
            .filter((branch) => branch !== '' && branch !== 'main'),
        ],
      },
    ])
    .then((answers) => {
      exec(`gh pr create --base ${answers.branch} --web`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
    });
});
