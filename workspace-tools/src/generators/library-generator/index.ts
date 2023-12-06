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
} from '@nx/devkit';
import { libraryGenerator, angularMoveGenerator } from '@nx/angular/generators';

export enum LibraryType {
  configuration = 'configuration',
  dataAccess = 'data-access',
  domain = 'domain',
  e2eUtil = 'e2e-util',
  environments = 'environments',
  feature = 'feature',
  testUtil = 'test-util',
  routing = 'routing',
  shell = 'shell',
  ui = 'ui',
  util = 'util',
}

export interface LibrarySchema {
  domain: string;
  libraryType: LibraryType;
  name?: string;
  product: string;
}

export default async function (tree: Tree, schema: LibrarySchema) {
  validateParams(schema);

  const { fileName: libType, className: libTypeClassName } = names(schema.libraryType);
  const { fileName: libName, className: libClassName } = names(schema.name ?? '');
  const { fileName: libDomain, className: libDomainClassName } = names(schema.domain);
  const { fileName: libProduct, className: libProductClassName } = names(schema.product);

  const libPath = getFinalLibraryPath({
    libDomain,
    libType: schema.libraryType,
    libName,
    libProduct,
  });

  await libraryGenerator(tree, {
    name: getFinalLibraryName(schema.libraryType, libName),
    directory: `${libProduct}/${libDomain}`,
    tags: `product:${libProduct}, domain:${libDomain}, type:${libType}`,
    prefix: `${libProduct}`,
    importPath: `@energinet-datahub/${libProduct}/${libDomain}/${
      libName !== '' ? libName : libType
    }`,
    strict: true,
    skipModule: [
      ...Object.values(LibraryType)
    ].includes(schema.libraryType),
  });

  updateTestSetupFile(tree, { libPath, libType, libProduct });
  updateReadmeFile(tree, {
    libPath,
    libType,
    libName,
    libDomain,
  });
  updateProjectJsonFile(tree, libPath);

  if (libType === LibraryType.dataAccess) {
    addDataAccessSpecificFiles(tree, {
      libPath,
      libType,
      libName,
      libDomain,
      className: `${libProductClassName}${libDomainClassName}${libTypeClassName}${libClassName}`,
      libProduct,
      stateInterface: libDomainClassName,
    });
  } else if (libType === LibraryType.shell) {
    addShellSpecificFiles(tree, {
      libPath,
      libDomain,
      className: `${libProduct}${libDomainClassName}`,
      libProduct,
    });
  } else if (libType === LibraryType.routing) {
    // Necessary step since the libraryGenerator does not support
    // generating modules with routing suffix without the --skipImport
    // flag, which does not currently work with workspace-generators:
    // https://github.com/nrwl/nx/pull/10167#issuecomment-1126146451
    await angularMoveGenerator(tree, {
      updateImportPath: true,
      importPath: `@energinet-datahub/${libProduct}/${libDomain}/routing`,
      projectName: `${libProduct}-${libDomain}-routing-tmpl`,
      destination: `${libProduct}/${libDomain}/routing`,
    });

    addRoutingSpecificFiles(tree, {
      libPath: libPath.replace('-tmpl', ''),
      libDomain,
      libProduct,
      className: libDomainClassName,
    });
  }

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

function getFinalLibraryPath(options: {
  libDomain: string;
  libType: LibraryType;
  libName: string;
  libProduct: string;
}): string {
  switch (options.libType) {
    case LibraryType.routing:
      return `./libs/${options.libProduct}/${options.libDomain}/routing-tmpl`;
    case LibraryType.domain:
    case LibraryType.environments:
    case LibraryType.shell:
      return `./libs/${options.libProduct}/${options.libDomain}/${options.libType}`;
    case LibraryType.configuration:
    case LibraryType.dataAccess:
    case LibraryType.e2eUtil:
    case LibraryType.feature:
    case LibraryType.testUtil:
    case LibraryType.ui:
    case LibraryType.util:
      return `./libs/${options.libProduct}/${options.libDomain}/${options.libType}-${options.libName}`;
  }
}

/**
 * Adds $schema property to project.json file
 */
function updateProjectJsonFile(tree: Tree, libPath: string) {
  updateJson(tree, `${libPath}/project.json`, (json) => {
    if (json.$schema === undefined) {
      const $schema = `${offsetFromRoot(libPath)}node_modules/nx/schemas/project-schema.json`;

      return {
        $schema,
        ...json,
      };
    }

    return json;
  });
}

/**
 * Replace auto-generated content with a heading
 */
function updateReadmeFile(
  tree: Tree,
  options: {
    libPath: string;
    libName: string;
    libType: string;
    libDomain: string;
  }
) {
  const readmeFilePath = `${options.libPath}/README.md`;
  const content = `# ${capitalizeWords(options.libName || options.libDomain)} ${capitalizeWords(
    options.libType
  )}\n`;

  tree.write(readmeFilePath, content);
}

function addDataAccessSpecificFiles(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    className: string;
    libType: string;
    libName: string;
    libProduct: string;
    stateInterface: string;
  }
) {
  generateEmptyStore(tree, options);
  exposeEmptyStoreFromLibrary(tree, options);
}

function addShellSpecificFiles(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    className: string;
    libProduct: string;
  }
) {
  replaceShellModule(tree, options);
}

function replaceShellModule(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    libProduct: string;
  }
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, `./files/shell/module`),
    `${options.libPath}/src/lib`,
    {
      tmpl: '',
      domain: options.libDomain,
      product: options.libProduct,
    }
  );
}

/**
 * Generate an empty store for data-access library
 */
function generateEmptyStore(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    className: string;
    libType: string;
    libName: string;
    stateInterface: string;
  }
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, `./files/data-access/store`),
    `${options.libPath}/src/lib`,
    {
      tmpl: '',
      domain: options.libDomain,
      type: options.libType,
      name: options.libName,
      className: options.className,
      stateInterface: options.stateInterface,
    }
  );
}

function exposeEmptyStoreFromLibrary(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    libType: string;
    libName: string;
    libProduct: string;
  }
) {
  const indexPath = `${options.libPath}/src/index.ts`;
  const storeFileName = `${options.libProduct}-${options.libDomain}-${options.libType}-${options.libName}.store`;
  const content = `export * from './lib/${storeFileName}';\n`;

  tree.write(indexPath, content);
}

function addRoutingSpecificFiles(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    libProduct: string;
    className: string;
  }
) {
  generateConstantFile(tree, options);
  exposeConstantFromLibrary(tree, options);
}

function generateConstantFile(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    libProduct: string;
    className: string;
  }
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, `./files/routing/constant`),
    `${options.libPath}/src/lib`,
    {
      tmpl: '',
      domain: options.libDomain,
      className: options.className,
    }
  );
}

function exposeConstantFromLibrary(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    libProduct: string;
    className: string;
  }
) {
  const indexPath = `${options.libPath}/src/index.ts`;
  const pathFileName = `${options.libProduct}-${options.libDomain}-path`;
  const content = `export * from './lib/${pathFileName}';\n`;

  tree.write(indexPath, content);
}

function getFinalLibraryName(libType: LibraryType, libName: string): string {
  switch (libType) {
    case LibraryType.routing:
      return 'routing-tmpl';
    case LibraryType.domain:
    case LibraryType.environments:
    case LibraryType.shell:
      return libType;
    case LibraryType.configuration:
    case LibraryType.dataAccess:
    case LibraryType.e2eUtil:
    case LibraryType.feature:
    case LibraryType.testUtil:
    case LibraryType.ui:
    case LibraryType.util:
      return `${libType}-${libName}`;
  }
}

/**
 * Replace test-setup.ts file with a template that imports all necessary dependencies
 */
function updateTestSetupFile(
  tree: Tree,
  options: {
    libPath: string;
    libType: string;
    libProduct: string;
  }
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, `./files/${options.libType}/test-setup`),
    `${options.libPath}/src`,
    { tmpl: '',  product: options.libProduct }
  );
}

function validateParams(schema: LibrarySchema) {
  if (!schema.name) return;
  switch (schema.libraryType) {
    case LibraryType.routing:
    case LibraryType.domain:
    case LibraryType.environments:
    case LibraryType.shell:
      if (!schema.name.length) return;
      throw new Error(
        `Leave the "name" field empty when the selected library type is "${schema.libraryType}".`
      );
    case LibraryType.configuration:
    case LibraryType.dataAccess:
    case LibraryType.e2eUtil:
    case LibraryType.feature:
    case LibraryType.testUtil:
    case LibraryType.ui:
    case LibraryType.util:
      if (!schema.name.startsWith(schema.libraryType)) return;
      throw new Error(
        `No need to prefix "name" with "${schema.name}". This is done automatically.`
      );
    default: {
      const exhaustiveCheck: never = schema.libraryType;
      throw new Error(`Unhandled library case: ${exhaustiveCheck}`);
    }
  }
}

function capitalizeWords(value: string): string {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
    .join(' ')
    .replace('E2e', 'E2E'); // Special case for e2e-util
}
