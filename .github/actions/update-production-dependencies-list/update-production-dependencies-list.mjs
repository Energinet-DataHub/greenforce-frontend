import * as fs from 'fs';

try {
  const dependencies = process.argv.slice(2)[0];
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
      const atSymbolLastIndex = key.lastIndexOf('@');

      const name = key.slice(0, atSymbolLastIndex);
      const version = key.slice(atSymbolLastIndex + 1);

      return `| [${name}](${value.repository}) | ${version} | ${value.licenses} |`;
    })
    .join('\n');

  try {
    fs.writeFileSync('PRODUCTION_DEPENDENCIES.md', `${header}${content}\n`);
  } catch (err) {
    console.error(err);
  }
}
