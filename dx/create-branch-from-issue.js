#!/usr/bin/env node

import { exec } from "child_process";

const issue = process.argv[2];

if (!issue) {
  console.log("Please provide an issue number");
  process.exit(1);
}

exec(`gh issue develop ${issue} --checkout`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Created, and checkout ${stdout.replace('github.com/Energinet-DataHub/greenforce-frontend/tree/', '')}`);
});
