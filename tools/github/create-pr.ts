import { exec } from 'child_process';

exec(`gh pr create --web`, (err, stdout) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(stdout);
});
