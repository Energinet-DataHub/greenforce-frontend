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
import { Tree, formatFiles, generateFiles, joinPathFragments, names, updateJson } from '@nx/devkit';
import { GenerateLibrarySchema, LibraryType } from './schema';

// Library types that don't require a name suffix
const TYPES_WITHOUT_NAME = ['domain', 'environments', 'shell'] as const;

// Library types that require a name suffix
const TYPES_WITH_NAME = [
  'configuration',
  'data-access',
  'e2e-util',
  'feature',
  'test-util',
  'ui',
  'util',
] as const;

// Type-safe includes helper
function isTypeWithoutName(type: LibraryType): boolean {
  return (TYPES_WITHOUT_NAME as readonly string[]).includes(type);
}

function isTypeWithName(type: LibraryType): boolean {
  return (TYPES_WITH_NAME as readonly string[]).includes(type);
}

/**
 * Generator for implicit libraries
 *
 * Creates a minimal library structure that is automatically detected by
 * the implicit-libs plugin (tools/plugins/implicit-libs.ts).
 *
 * Generated structure:
 * libs/{product}/{domain}/{type}-{name}/
 *   ├── index.ts
 *   └── README.md
 *
 * The plugin will automatically:
 * - Detect the library from the index.ts file
 * - Infer project name from path (e.g., dh-admin-feature-user-management)
 * - Apply tags based on path structure (product, domain, type)
 * - Create lint and test targets
 */
export default async function (tree: Tree, schema: GenerateLibrarySchema) {
  validateParams(schema);

  const { fileName: libType } = names(schema.libraryType);
  const { fileName: libName, className: libClassName } = names(schema.name ?? '');
  const { fileName: libDomain, className: libDomainClassName } = names(schema.domain);
  const { fileName: libProduct, className: libProductClassName } = names(schema.product);

  const libPath = getLibraryPath({
    libDomain,
    libType: schema.libraryType,
    libName,
    libProduct,
  });

  const importPath = getImportPath({
    libProduct,
    libDomain,
    libType: schema.libraryType,
    libName,
  });

  // Create the library directory structure
  createLibraryFiles(tree, {
    libPath,
    libType: schema.libraryType,
    libName,
    libDomain,
    libProduct,
    libDomainClassName,
    libProductClassName,
    libClassName,
  });

  // Add path alias to tsconfig.base.json
  addPathAlias(tree, importPath, libPath);

  await formatFiles(tree);
}

interface LibraryPathOptions {
  libDomain: string;
  libType: LibraryType;
  libName: string;
  libProduct: string;
}

function getLibraryPath(options: LibraryPathOptions): string {
  const { libDomain, libType, libName, libProduct } = options;

  if (isTypeWithoutName(libType)) {
    return `libs/${libProduct}/${libDomain}/${libType}`;
  }
  return `libs/${libProduct}/${libDomain}/${libType}-${libName}`;
}

function getImportPath(options: LibraryPathOptions): string {
  const { libProduct, libDomain, libType, libName } = options;

  if (isTypeWithoutName(libType)) {
    return `@energinet-datahub/${libProduct}/${libDomain}/${libType}`;
  }
  return `@energinet-datahub/${libProduct}/${libDomain}/${libType}-${libName}`;
}

interface CreateFilesOptions {
  libPath: string;
  libType: LibraryType;
  libName: string;
  libDomain: string;
  libProduct: string;
  libDomainClassName: string;
  libProductClassName: string;
  libClassName: string;
}

function createLibraryFiles(tree: Tree, options: CreateFilesOptions) {
  const {
    libPath,
    libType,
    libName,
    libDomain,
    libProduct,
    libDomainClassName,
    libProductClassName,
    libClassName,
  } = options;

  // Create README.md
  const readmeContent = `# ${capitalizeWords(libName || libDomain)} ${capitalizeWords(libType)}\n`;
  tree.write(`${libPath}/README.md`, readmeContent);

  // Create index.ts based on library type
  if (libType === 'shell') {
    createShellFiles(tree, { libPath, libDomain, libProduct });
  } else if (libType === 'data-access') {
    createDataAccessFiles(tree, {
      libPath,
      libDomain,
      libProduct,
      libName,
      className: `${libProductClassName}${libDomainClassName}DataAccess${libClassName}`,
      stateInterface: libDomainClassName,
    });
  } else {
    // Create empty index.ts for other library types
    createEmptyIndex(tree, libPath);
  }
}

function createEmptyIndex(tree: Tree, libPath: string) {
  const licenseHeader = getLicenseHeader();
  tree.write(`${libPath}/index.ts`, `${licenseHeader}\n`);
}

function createShellFiles(
  tree: Tree,
  options: { libPath: string; libDomain: string; libProduct: string }
) {
  const { libPath, libDomain, libProduct } = options;

  // Generate shell routes file at library root
  generateFiles(tree, joinPathFragments(__dirname, `./files/shell/module`), libPath, {
    tmpl: '',
    domain: libDomain,
    product: libProduct,
  });

  // Create index.ts that exports the routes
  const licenseHeader = getLicenseHeader();
  const indexContent = `${licenseHeader}
export { ${libProduct}${capitalizeWords(libDomain).replace(/ /g, '')}ShellRoutes } from './${libProduct}-${libDomain}-shell.routes';
`;
  tree.write(`${libPath}/index.ts`, indexContent);
}

function createDataAccessFiles(
  tree: Tree,
  options: {
    libPath: string;
    libDomain: string;
    libProduct: string;
    libName: string;
    className: string;
    stateInterface: string;
  }
) {
  const { libPath, libDomain, libProduct, libName, className, stateInterface } = options;

  // Generate store file at library root
  generateFiles(tree, joinPathFragments(__dirname, `./files/data-access/store`), libPath, {
    tmpl: '',
    product: libProduct,
    domain: libDomain,
    type: 'data-access',
    name: libName,
    className,
    stateInterface,
  });

  // Create index.ts that exports the store
  const licenseHeader = getLicenseHeader();
  const storeFileName = `${libProduct}-${libDomain}-data-access-${libName}.store`;
  const indexContent = `${licenseHeader}
export * from './${storeFileName}';
`;
  tree.write(`${libPath}/index.ts`, indexContent);
}

function addPathAlias(tree: Tree, importPath: string, libPath: string) {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    const paths = json.compilerOptions?.paths ?? {};

    // Add the new path alias if it doesn't exist
    if (!paths[importPath]) {
      paths[importPath] = [`${libPath}/index.ts`];
    }

    // Sort paths alphabetically for consistency
    const sortedPaths = Object.keys(paths)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = paths[key];
          return acc;
        },
        {} as Record<string, string[]>
      );

    json.compilerOptions = {
      ...json.compilerOptions,
      paths: sortedPaths,
    };

    return json;
  });
}

function validateParams(schema: GenerateLibrarySchema) {
  if (!schema) {
    throw new Error('Schema is required');
  }
  if (!schema.domain) {
    throw new Error('Domain is required');
  }
  if (!schema.libraryType) {
    throw new Error('Library type is required');
  }
  if (!schema.product) {
    throw new Error('Product is required');
  }

  // For types without name, ensure name is not provided
  if (isTypeWithoutName(schema.libraryType)) {
    if (schema.name && schema.name.length > 0) {
      throw new Error(
        `Leave the "name" field empty when the selected library type is "${schema.libraryType}".`
      );
    }
    return;
  }

  // For types with name, ensure name is provided and not prefixed with type
  if (isTypeWithName(schema.libraryType)) {
    if (!schema.name) {
      throw new Error(`Name is required for library type "${schema.libraryType}".`);
    }
    if (schema.name.startsWith(schema.libraryType)) {
      throw new Error(
        `No need to prefix "name" with "${schema.libraryType}". This is done automatically.`
      );
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

function getLicenseHeader(): string {
  return `//#region License
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
//#endregion`;
}
