/**
 * This script transforms generated NSwag client code to make the api_version parameter
 * optional with a default value of null. It moves the parameter to the end of the
 * parameter list and adds a default value.
 *
 * Usage: bun run default-api-version-param.ts <filePath>
 *
 * This is a TypeScript replacement for the PowerShell script `default-api-version-param.ps1`
 */

import { readFileSync, writeFileSync } from 'fs';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: bun run default-api-version-param.ts <filePath>');
  process.exit(1);
}

const content = readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const transformedLines = lines.map((line) => {
  // Case 1: api_version is at the start of params: "string? api_version, "
  if (line.includes('string? api_version, ')) {
    const mod = line.replace('string? api_version, ', '');
    return mod.replace(')', ', string? api_version = null)');
  }

  // Case 2: api_version is at the end of params: ", string? api_version)"
  if (line.includes(', string? api_version)')) {
    const mod = line.replace(', string? api_version', '');
    return mod.replace(')', ', string? api_version = null)');
  }

  // Case 3: api_version is the only param: "(string? api_version)"
  if (line.includes('(string? api_version)')) {
    return line.replace('string? api_version', 'string? api_version = null');
  }

  // Case 4: api_version usage at start of args (not in url): "(api_version, "
  if (/.*\(api_version,.*/.test(line) && !line.includes('url')) {
    const mod = line.replace('api_version, ', '');
    return mod.replace(')', ', api_version)');
  }

  // Case 5: api_version usage in middle of args: ", api_version,"
  if (/.*, api_version,.*/.test(line)) {
    const mod = line.replace(', api_version', '');
    return mod.replace(')', ', api_version)');
  }

  return line;
});

writeFileSync(filePath, transformedLines.join('\n'));
console.log(`Transformed ${filePath}`);
