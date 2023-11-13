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
