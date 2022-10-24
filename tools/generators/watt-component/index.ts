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
import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  Tree,
  updateJson,
} from '@nrwl/devkit';

export default async function (host: Tree, schema: { name: string }) {
  const substitutions = names(schema.name);

  // Generate component files from template files
  generateFiles(
    host,
    joinPathFragments(__dirname, './files'),
    `./libs/ui-watt/src/lib/components/${substitutions.fileName}`,
    { tmpl: '', ...substitutions }
  );

  // Add reference to base configuration
  updateJson(host, './tsconfig.base.json', (json) => {
    json.compilerOptions.paths[
      `@energinet-datahub/ui-watt/${substitutions.fileName}`
    ] = [
      `libs/ui-watt/src/lib/components/${substitutions.fileName}/src/index.ts`,
    ];
    return json;
  });

  await formatFiles(host);
}
