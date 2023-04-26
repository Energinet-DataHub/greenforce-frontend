import inquirer from 'inquirer';
import { exec } from 'child_process';

const teams = [
  {
    team: 'Titans',
    repo: 'Energinet-DataHub/Titans',
  },
  {
    team: 'Mandalorian',
    repo: 'Energinet-DataHub/opengeh-wholesale',
  },
];

inquirer
  .prompt([
    {
      type: 'list',
      name: 'team',
      message: 'Choose team:',
      choices: teams.map((team) => team.team),
    },
    {
      type: 'input',
      name: 'issue',
      message: 'Type issue number or select from list',
    },
  ])
  .then((answers) => {
    const selectedRepo = teams.find((team) => team.team === answers.team).repo;
    if (answers.issue === '') {
      exec(`gh issue list --repo ${selectedRepo} --json title,number`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        const issues = JSON.parse(stdout);

        inquirer
          .prompt([
            {
              type: 'list',
              name: 'issue',
              message: 'Choose issue:',
              choices: issues.map((issue) => `${issue.number}: ${issue.title}`),
            },
          ])
          .then((answers) => {
            const issue = answers.issue.split(':')[0].trim();
            createBracnhFromIssue(issue, selectedRepo);
          });
      });
    } else {
      createBracnhFromIssue(answers.issue, selectedRepo);
    }
  });

function createBracnhFromIssue(issue, selectedRepo) {
  exec(
    `gh issue develop ${issue} --issue-repo ${selectedRepo} --checkout`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(
        `Created, and checkout ${stdout.replace(
          'github.com/Energinet-DataHub/greenforce-frontend/tree/',
          ''
        )}`
      );
    }
  );
}
