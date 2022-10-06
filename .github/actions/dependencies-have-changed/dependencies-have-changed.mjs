import { execSync } from 'child_process';

try {
  const changedFiles = readChangedFiles();
  const hasChanged = haveDependenciesChanged(changedFiles);
  console.log(hasChanged);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function readChangedFiles() {
  const changedFiles = execSync(`git diff origin/main... --name-only`, {
    encoding: 'utf-8',
  });
  return changedFiles.trim().replaceAll(/\s/g, ',').split(',');
}

function haveDependenciesChanged(changes) {
  return changes.some((change) => {
    return change.search(/yarn\.lock|package\.json/) !== -1;
  });
}
