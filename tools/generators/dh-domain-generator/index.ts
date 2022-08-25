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
import { installPackagesTask, Tree } from '@nrwl/devkit';
import dhLibraryGenerator, { LibraryType } from '../dh-library-generator';

interface Schema {
  domain: string;
  name: string;
}

export default async function (tree: Tree, schema: Schema) {
  await dhLibraryGenerator(tree, {
    domain: schema.domain,
    libraryType: LibraryType.feature,
    name: schema.name,
  });

  await dhLibraryGenerator(tree, {
    domain: schema.domain,
    libraryType: LibraryType.routing,
  });

  await dhLibraryGenerator(tree, {
    domain: schema.domain,
    libraryType: LibraryType.dataAccess,
    name: 'api',
  });

  await dhLibraryGenerator(tree, {
    domain: schema.domain,
    libraryType: LibraryType.shell,
  });

  return () => {
    installPackagesTask(tree);
  };
}
