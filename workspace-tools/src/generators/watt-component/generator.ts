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
import { formatFiles, generateFiles, names, Tree, updateJson } from '@nx/devkit';
import * as path from 'path';
import { WattComponentGeneratorSchema } from './schema';

export async function wattComponentGenerator(tree: Tree, options: WattComponentGeneratorSchema) {
  const substitutions = names(options.name);
  const projectRoot = `libs/watt/src/lib/components/${options.name}`;

  // Generate component files from template files
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, substitutions);

  // Add reference to base configuration
  updateJson(tree, './tsconfig.base.json', (json) => {
    json.compilerOptions.paths[`@energinet-datahub/watt/${substitutions.fileName}`] = [
      `libs/watt/src/lib/components/${substitutions.fileName}/index.ts`,
    ];
    return json;
  });

  await formatFiles(tree);
}

export default wattComponentGenerator;
