#!/usr/bin/env node

import { exec } from "child_process";
import inquirer from 'inquirer';


exec(`git show-branch | grep '*' | grep -v "$(git rev-parse --abbrev-ref HEAD)" | head -n1 | sed 's/.*\[\(.*\)\].*/\1/' | sed 's/[\^~].*//'`, { encoding: 'utf-8' }, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(stdout);
});

// exec(`git branch`, (err, stdout, stderr) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }

//   inquirer
//   .prompt([
//     {
//       type: 'list',
//       name: 'branch',
//       message: 'Choose branch',
//       choices:  stdout.split('\n').filter((branch) => branch !== ''),
//     },
//   ])
//   .then((answers) => {
//     console.log(answers.branch.trim());
//   });

// });


// exec(`gh pr create --web`, (err, stdout, stderr) => {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   }

//   console.log(`Created, and checkout ${stdout.replace('github.com/Energinet-DataHub/greenforce-frontend/tree/', '')}`);
// });
