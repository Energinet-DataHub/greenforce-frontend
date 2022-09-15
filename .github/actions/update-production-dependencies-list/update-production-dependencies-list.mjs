import * as fs from 'fs';
import core from '@actions/core';

try {
  const dependencies = core.getInput('dependencies-from-license-checker');
  writeProductionDependencyLicenses(dependencies);
  console.log('PRODUCTION_DEPENDENCIES.md updated');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

function writeProductionDependencyLicenses(licenses) {
  const parsedLicenses = JSON.parse(licenses);
  const header = `# Production Dependencies

  | Name | Version | License |
  | ---- | ------- | ------- |
  `;
  const content = Object.entries(parsedLicenses)
    .map(([key, value]) => {
      const splittedKey = key.split('@');
      const name = splittedKey[splittedKey.length - 2];
      const version = key.split('@')[splittedKey.length - 1];
      return `| [${name}](${value.repository}) | ${version} | [${value.licenses}](${value.licenseFile}) |`;
    })
    .join('\n');

  try {
    fs.writeFileSync('PRODUCTION_DEPENDENCIES.md', `${header}${content}`);
  } catch (err) {
    console.error(err);
  }
}
