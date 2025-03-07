import { globAsync, Tree, readJson } from '@nx/devkit';
import { minimatch } from 'minimatch';
import { readFileAsync } from '../util';

export async function addLicenseGenerator(tree: Tree) {
  const config = readJson(tree, '.licenserc.json');
  const ignore: string[] = config.ignore;
  const globs = Object.keys(config).filter((glob) => glob !== 'ignore');
  const files = await globAsync(tree, globs);
  for (const file of files) {
    if (ignore.some((p) => minimatch(file, p))) continue;
    const key = globs.find((glob) => minimatch(file, glob, { dot: true }));
    if (!key) return { success: false };
    const license = config[key].join('\n');
    const data = await readFileAsync(file);
    if (data.trim().startsWith(license.trim())) continue;
    tree.write(file, `${license}\n${data}`);
  }
}

export default addLicenseGenerator;
