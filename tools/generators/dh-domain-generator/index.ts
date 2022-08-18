import { Tree } from '@nrwl/devkit';
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
}
