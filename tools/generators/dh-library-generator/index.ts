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
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  names,
  updateJson,
  offsetFromRoot,
} from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/angular/generators';

interface DhFeatureLibSchema {
  name: string;
  domain: string;
}

export default async function (tree: Tree, schema: DhFeatureLibSchema) {
  validateParams(schema);

  const libName = names(schema.name).fileName;
  const libDomain = names(schema.domain).fileName;
  const libPath = `./libs/dh/${libDomain}/feature-${libName}`;

  await libraryGenerator(tree, {
    name: `feature-${libName}`,
    directory: `dh/${libDomain}`,
    tags: `product:dh, domain:${libDomain}, type:feature`,
    prefix: 'dh',
    strict: true,
  });

  updateTestSetupFile(tree, libPath);
  updateReadmeFile(tree, libPath, libName);
  updateProjectJsonFile(tree, libPath);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

/**
 * Adds $schema property to project.json file
 * @param tree
 * @param libPath
 */
function updateProjectJsonFile(tree: Tree, libPath: string) {
  updateJson(tree, `${libPath}/project.json`, (json) => {
    if (json.$schema === undefined) {
      const $schema = `${offsetFromRoot(
        libPath
      )}node_modules/nx/schemas/project-schema.json`;

      return {
        $schema,
        ...json,
      };
    }

    return json;
  });
}

/**
 * Replaces auto-generated content with a heading
 * @param tree
 * @param libPath
 * @param libName
 */
function updateReadmeFile(tree: Tree, libPath: string, libName: string) {
  const readmeFilePath = `${libPath}/README.md`;

  tree.write(readmeFilePath, `# ${capitalizeWords(libName)} Feature\n`);
}

/**
 * Replaces test-setup.ts file with a template that imports all necessary dependencies
 * @param tree
 * @param libPath
 */
function updateTestSetupFile(tree: Tree, libPath: string) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    `${libPath}/src`,
    { tmpl: '' }
  );
}

function validateParams(schema: DhFeatureLibSchema) {
  if (schema.name.startsWith('feature-')) {
    throw new Error(
      'No need to prefix "name" with "feature-". This is done automatically.'
    );
  }
}

function capitalizeWords(value: string): string {
  return value
    .split('-')
    .map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    )
    .join(' ');
}
