import {
  PromiseExecutor,
  createProjectGraphAsync,
  readJsonFile,
  joinPathFragments,
} from '@nx/devkit';
import { PeerDependenciesExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<PeerDependenciesExecutorSchema> = async (options, context) => {
  const { dependencies } = readJsonFile(joinPathFragments(context.root, 'package.json'));
  const projectGraph = await createProjectGraphAsync();
  const peerDependencies = projectGraph.dependencies['watt']
    .filter((d) => d.type === 'static')
    .filter((d) => d.target.startsWith('npm:'))
    .map((d) => d.target)
    .map((t) => t.split(':')[1])
    .filter((k) => dependencies[k])
    .sort()
    .reduce((p, k) => ({ ...p, [k]: `^${dependencies[k]}` }), {});

  console.log(peerDependencies);

  return {
    success: true,
  };
};

export default runExecutor;
