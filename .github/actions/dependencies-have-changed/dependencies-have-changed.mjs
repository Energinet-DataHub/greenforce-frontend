import { execSync } from 'child_process';
import * as core from '@actions/core'

try {
  const changedFiles = readChangedFiles();
  const result = haveDependenciesChanged(changedFiles);
  console.log(result);
  core.setOutput("dependenciesHaveChanged", result);
} catch (error) {
  core.setFailed(error.message);
}

function readChangedFiles() {
  const changedFiles = execSync(
    `git diff main... --name-only`,
    {
      encoding: 'utf-8',
    }
  );
  return changedFiles.replaceAll(/\s/g, ',').split(',');
}

function haveDependenciesChanged(changes) {
  return changes.some((change) => {
    return change.search(/yarn\.lock|package\.json/) !== -1;
  });
}
