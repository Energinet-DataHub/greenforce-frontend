import {
  PromiseExecutor,
  createProjectGraphAsync,
  readJsonFile,
  joinPathFragments,
  writeJsonFile,
} from '@nx/devkit';
import { PeerDependenciesExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<PeerDependenciesExecutorSchema> = async (options, context) => {
  const { dependencies } = readJsonFile(joinPathFragments(context.root, 'package.json'));
  const projectGraph = await createProjectGraphAsync();
  const peerDependencies = projectGraph.dependencies[options.project]
    .filter((d) => d.type === 'static')
    .filter((d) => d.target.startsWith('npm:'))
    .map((d) => d.target)
    .map((t) => t.split(':')[1])
    .filter((k) => dependencies[k])
    .sort()
    .reduce((p, k) => ({ ...p, [k]: `^${dependencies[k]}` }), {});

  const packageJsonPath = joinPathFragments(context.root, options.packageJson);
  const packageJson = readJsonFile(packageJsonPath);
  packageJson.peerDependencies = peerDependencies;
  writeJsonFile(packageJsonPath, packageJson);

  return { success: true };
};

export default runExecutor;
