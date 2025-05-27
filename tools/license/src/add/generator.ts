//#region License
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
//#endregion
import { readFile } from 'fs/promises';
import { globAsync, Tree, readJson } from '@nx/devkit';
import { minimatch } from 'minimatch';

export async function addLicenseGenerator(tree: Tree) {
  const config = readJson(tree, '.licenserc.json');
  const ignore: string[] = config.ignore;
  const globs = Object.keys(config).filter((glob) => glob !== 'ignore');
  const files = await globAsync(tree, globs);

  for (const file of files) {
    if (ignore.some((p) => minimatch(file, p))) continue;

    const key = globs.find((glob) => minimatch(file, glob, { dot: true }));
    if (!key) return { success: false };

    const license = extractRegionContent(config[key].join('\n'), 'License');
    const data = await readFile(file, { encoding: 'utf-8' });
    const licenseInFile = extractRegionContent(data, 'License');
    const normalizedLicense = license.replace(/\r\n/g, '\n').trim();
    const normalizedLicenseInFile = licenseInFile.replace(/\r\n/g, '\n').trim();

    if (normalizedLicense === normalizedLicenseInFile) continue;

    const updatedData = licenseInFile
      ? data.replace(licenseInFile, license).replace(/\n+(?=\S)/m, '\n')
      : `${license}\n${data.trimStart()}`;

    tree.write(file, updatedData);
  }
}

function extractRegionContent(content: string, regionName: string): string {
  const regionRegex = new RegExp(`//#region ${regionName}[\\s\\S]*?//#endregion`, 'g');
  const match = content.match(regionRegex);
  return match ? match[0] : '';
}

export default addLicenseGenerator;
