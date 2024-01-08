/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as fs from 'fs';
import { globSync } from 'glob';
import * as path from 'path';

// eslint-disable-next-line @nx/enforce-module-boundaries
import * as config from '../../../.licenserc.json';

interface LicenseExecutorOptions {
  dryRun: boolean;
}

interface JSONObject {
  [x: string]: string[];
}

export default async function addLicenseExecutor(options: LicenseExecutorOptions) {
  const globs = Object.keys(config).filter((glob) => glob !== 'ignore');

  let success = true;

  console.info(`Adding licenses...`);
  const files = globSync(`{,!(node_modules|dist)/**/*}*{${globs.join(',')}}`, {
    ignore: config.ignore,
  });

  files.forEach((file) => {
    try {
      const isDirectory = fs.existsSync(file) && fs.lstatSync(file).isDirectory();
      if (isDirectory) return;

      const data = fs.readFileSync(file, 'utf8');

      const licenseConfig = getLicenseConfig(config, file);
      if (!licenseConfig) {
        console.error(`No license config found for: ${file}`);
        success = false;
        return;
      }

      const licenseTxt = licenseConfig.join('\n');
      const isLicensed = checkForLicense(data, licenseTxt);

      if (!isLicensed) {
        const result = addLicense(file, data, licenseTxt, options);
        if (!result) success = false;
      }
    } catch (err) {
      console.error(`Couldn't read file: ${file}, ${err}`);
      success = false;
    }
  });
  return { success };
}

function getLicenseConfig(config: JSONObject, file: string): string[] {
  const fileExt = path.extname(file).replace('.', '');
  const key = Object.keys(config).find((glob) => {
    return glob.includes(fileExt);
  });
  return config[key as string];
}

function addLicense(
  file: string,
  content: string,
  license: string,
  options: LicenseExecutorOptions
): boolean {
  try {
    if (!options.dryRun) {
      fs.writeFileSync(file, license + '\n' + content);
    }
    console.log('Added license to', file);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function checkForLicense(content: string, license: string): boolean {
  if (!license) {
    return false;
  }

  return removeWhitespace(content).startsWith(removeWhitespace(license));
}

function removeWhitespace(str: string): string {
  return str.replace(/\s/g, '');
}
