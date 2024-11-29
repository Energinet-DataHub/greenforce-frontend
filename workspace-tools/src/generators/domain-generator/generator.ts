import { installPackagesTask, Tree } from '@nx/devkit';
import libraryGenerator, { LibraryType } from '../library-generator/generator';

interface Schema {
  domain: string;
  name: string;
  product: string;
}

export default async function (tree: Tree, schema: Schema) {
  await libraryGenerator(tree, {
    domain: schema.domain,
    libraryType: LibraryType.feature,
    name: schema.name,
    product: schema.product,
  });

  await libraryGenerator(tree, {
    domain: schema.domain,
    libraryType: LibraryType.dataAccess,
    name: 'api',
    product: schema.product,
  });

  await libraryGenerator(tree, {
    domain: schema.domain,
    libraryType: LibraryType.shell,
    product: schema.product,
  });

  return () => {
    installPackagesTask(tree);
  };
}
