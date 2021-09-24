/* Copyright 2020 Energinet DataHub A/S,
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
import { ExecutorContext } from '@nrwl/devkit';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as config from './../../../.licenserc.json';

export default async function addLicenseExecutor(
  options: null,
  context: ExecutorContext
) {
  const projectRoot = context.workspace.projects[context.projectName].root;
  const globs = Object.keys(config);
  const licenses = {};
  globs.forEach((glob) => {
    licenses[path.extname(glob)] = config[glob];
  });
  console.info(`Adding licenses...`);
  
  const files = glob.sync(
    // Everything: '{,!(node_modules|dist)/**/}*{.ts,.scss,.html}',
    `apps/dh-app{/${globs.join(',/')}}`
  );

  files.forEach((file) => {
    try {
      const data = fs.readFileSync(file, 'utf8');
      const licenseTxt = licenses[path.extname(file)].join('\n');

      const isLicensed = checkForLicense(data, licenseTxt);
      console.log('is licensed:', isLicensed, file);

      if (!isLicensed) {
        addLicense(file, data, licenseTxt);
      }
    } catch (err) {
      console.error(err);
    }
  });

  const success = true;
  return { success };
}

function addLicense(file: string, content: string, license: string): boolean {
  try {
    fs.writeFileSync(file, license + '\n' + content);
    console.log('Added license to', file);
    return true;
  } catch (err) {
    console.error(err);
    return err;
  }
}

function checkForLicense(content: string, license: string): boolean {
  if (!license) return;
  return removeWhitespace(content).startsWith(removeWhitespace(license));
}

function removeWhitespace(str: string): string {
    return str.replace(/\s/g, '');
}
