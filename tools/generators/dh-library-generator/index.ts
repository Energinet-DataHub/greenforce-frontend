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
import {
  libraryGenerator,
  angularMoveGenerator,
} from '@nrwl/angular/generators';

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

export interface DhLibrarySchema {
  domain: string;
  libraryType: LibraryType;
  name?: string;
}

export default async function (tree: Tree, schema: DhLibrarySchema) {
  validateParams(schema);

  const { fileName: libType, className: libTypeClassName } = names(
    schema.libraryType
  );
  const { fileName: libName, className: libClassName } = names(
    schema.name ?? ''
  );
  const { fileName: libDomain, className: libDomainClassName } = names(
    schema.domain
  );

  const libPath = getFinalLibraryPath({
    libDomain,
    libType: schema.libraryType,
    libName,
  });

  await libraryGenerator(tree, {
    name: getFinalLibraryName(schema.libraryType, libName),
    directory: `dh/${libDomain}`,
    tags: `product:dh, domain:${libDomain}, type:${libType}`,
    prefix: 'dh',
    strict: true,
    skipModule: [
      LibraryType.dataAccess,
      LibraryType.domain,
      LibraryType.e2eUtil,
      LibraryType.environments,
      LibraryType.routing,
      LibraryType.testUtil,
    ].includes(schema.libraryType),
  });

  updateTestSetupFile(tree, { libPath, libType });
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
      className: `${libDomainClassName}${libTypeClassName}${libClassName}`,
      stateInterface: libDomainClassName,
    });
  } else if (libType === LibraryType.shell) {
    addShellSpecificFiles(tree, {
      libPath,
      libDomain,
      className: libDomainClassName,
    });
  } else if (libType === LibraryType.routing) {
    // Necessary step since the libraryGenerator does not support
    // generating modules with routing suffix without the --skipImport
    // flag, which does not currently work with workspace-generators:
    // https://github.com/nrwl/nx/pull/10167#issuecomment-1126146451
    await angularMoveGenerator(tree, {
      updateImportPath: true,
      importPath: `@energinet-datahub/dh/${libDomain}/routing`,
      projectName: `dh-${libDomain}-routing-tmpl`,
      destination: `dh/${libDomain}/routing`,
    });

    addRoutingSpecificFiles(tree, {
      libPath: libPath.replace('-tmpl', ''),
      libDomain,
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
}): string {
  switch (options.libType) {
    case LibraryType.routing:
      return `./libs/dh/${options.libDomain}/routing-tmpl`;
    case LibraryType.domain:
    case LibraryType.environments:
    case LibraryType.shell:
      return `./libs/dh/${options.libDomain}/${options.libType}`;
    case LibraryType.configuration:
    case LibraryType.dataAccess:
    case LibraryType.e2eUtil:
    case LibraryType.feature:
    case LibraryType.testUtil:
    case LibraryType.ui:
    case LibraryType.util:
      return `./libs/dh/${options.libDomain}/${options.libType}-${options.libName}`;
  }
}

/**
 * Adds $schema property to project.json file
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
  const content = `# ${capitalizeWords(
    options.libName || options.libDomain
  )} ${capitalizeWords(options.libType)}\n`;

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
  }
) {
  replaceShellModule(tree, options);
}

function replaceShellModule(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    className: string;
  }
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, `./files/shell/module`),
    `${options.libPath}/src/lib`,
    {
      tmpl: '',
      domain: options.libDomain,
      className: options.className,
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
  }
) {
  const indexPath = `${options.libPath}/src/index.ts`;
  const storeFileName = `dh-${options.libDomain}-${options.libType}-${options.libName}.store`;
  const content = `export * from './lib/${storeFileName}';\n`;

  tree.write(indexPath, content);
}

function addRoutingSpecificFiles(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
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
    className: string;
  }
) {
  const indexPath = `${options.libPath}/src/index.ts`;
  const pathFileName = `dh-${options.libDomain}-path`;
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
  }
) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, `./files/${options.libType}/test-setup`),
    `${options.libPath}/src`,
    { tmpl: '' }
  );
}

function validateParams(schema: DhLibrarySchema) {
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
    .map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    )
    .join(' ')
    .replace('E2e', 'E2E'); // Special case for e2e-util
}
