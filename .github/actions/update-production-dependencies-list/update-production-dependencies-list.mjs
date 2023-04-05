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
      const splittedKey = key.split('@');
      const name = splittedKey[splittedKey.length - 2];
      const version = key.split('@')[splittedKey.length - 1];

      // For some reason, `license-checker-rseidelsohn` doesn't include a `repository` property for `microsoft/applicationinsights-angularplugin-js`. In this case the `repository` will be `undefined` in the final output.
      // When that happens, the `CI orchestrator` action will fail because the link will not pass Markdown lint checks.
      // This is a temporary workaround to fix the issue.
      if (name === "microsoft/applicationinsights-angularplugin-js") {
        value.repository = "https://github.com/microsoft/applicationinsights-angularplugin-js"
      }

      return `| [${name}](${value.repository}) | ${version} | ${value.licenses} |`;
    })
    .join('\n');

  try {
    fs.writeFileSync('PRODUCTION_DEPENDENCIES.md', `${header}${content}\n`);
  } catch (err) {
    console.error(err);
  }
}
