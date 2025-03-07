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
import { globAsync, Tree, readJson } from '@nx/devkit';
import { minimatch } from 'minimatch';
import { readFileAsync } from '../util';

export async function addLicenseGenerator(tree: Tree) {
  const config = readJson(tree, '.licenserc.json');
  const ignore: string[] = config.ignore;
  const globs = Object.keys(config).filter((glob) => glob !== 'ignore');
  const files = await globAsync(tree, globs);
  for (const file of files) {
    if (ignore.some((p) => minimatch(file, p))) continue;
    const key = globs.find((glob) => minimatch(file, glob, { dot: true }));
    if (!key) return { success: false };
    const license = config[key].join('\n');
    const data = await readFileAsync(file);
    if (data.trim().startsWith(license.trim())) continue;
    tree.write(file, `${license}\n${data}`);
  }
}

export default addLicenseGenerator;
