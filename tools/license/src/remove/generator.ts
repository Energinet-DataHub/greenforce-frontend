import { globAsync, Tree, readJson } from '@nx/devkit';
import { minimatch } from 'minimatch';
import { RemoveLicenseGeneratorSchema } from './schema';
import { readFileAsync } from '../util';

export async function removeLicenseGenerator(tree: Tree, options: RemoveLicenseGeneratorSchema) {
  const config = readJson(tree, '.licenserc.json');
  const globs = Object.keys(config).filter((glob) => glob !== 'ignore');
  const files = await globAsync(tree, [options.pattern]);
  for (const file of files) {
    const key = globs.find((glob) => minimatch(file, glob, { dot: true }));
    if (!key) continue;
    const license = config[key].join('\n');
    const data = await readFileAsync(file);
    tree.write(file, data.replace(license, '').trimStart());
  }
}

export default removeLicenseGenerator;
