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
import { RemoveLicenseGeneratorSchema } from './schema';

export async function removeLicenseGenerator(tree: Tree, options: RemoveLicenseGeneratorSchema) {
  const config = readJson(tree, '.licenserc.json');
  const globs = Object.keys(config).filter((glob) => glob !== 'ignore');
  const files = await globAsync(tree, [options.pattern]);
  for (const file of files) {
    const key = globs.find((glob) => minimatch(file, glob, { dot: true }));
    if (!key) continue;
    const license = config[key].join('\n');
    const data = await readFile(file, { encoding: 'utf-8' });
    tree.write(file, data.replace(license, '').trimStart());
  }
}

export default removeLicenseGenerator;
