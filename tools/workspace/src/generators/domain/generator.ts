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
import { Tree } from '@nx/devkit';
import libraryGenerator from '../library/generator';
import { GenerateDomainSchema } from './schema';

/**
 * Domain generator - creates a complete domain with feature, data-access, and shell libraries
 *
 * This creates implicit libraries that are automatically detected by
 * the implicit-libs plugin (tools/plugins/implicit-libs.ts).
 */
export default async function (tree: Tree, schema: GenerateDomainSchema) {
  // Create feature library
  await libraryGenerator(tree, {
    domain: schema.domain,
    libraryType: 'feature',
    name: schema.name,
    product: schema.product,
  });

  // Create data-access library
  await libraryGenerator(tree, {
    domain: schema.domain,
    libraryType: 'data-access',
    name: 'api',
    product: schema.product,
  });

  // Create shell library
  await libraryGenerator(tree, {
    domain: schema.domain,
    libraryType: 'shell',
    product: schema.product,
  });
}
