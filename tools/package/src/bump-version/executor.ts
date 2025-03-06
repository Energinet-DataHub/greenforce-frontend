import { PromiseExecutor, readJsonFile, joinPathFragments, writeJsonFile } from '@nx/devkit';
import { exec } from 'child_process';
import { eq, gt, inc, rsort } from 'semver';
import { BumpVersionExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<BumpVersionExecutorSchema> = async (options, context) => {
  const packageJsonPath = joinPathFragments(context.root, options.packageJson);
  const packageJson = readJsonFile(packageJsonPath);
  const packageName = packageJson.name;

  const versions = await execAsync(`npm view axios versions --json`);
  // const versions = await execAsync(`npm view ${packageName} versions --json`);
  const [latestVersion] = rsort(JSON.parse(versions));

  // The version has already been updated
  if (!eq(packageJson.version, latestVersion)) {
    console.log('checking', gt(packageJson.version, latestVersion));
    // Return successfully if the new version is greater than the latest version
    return { success: gt(packageJson.version, latestVersion) };
  }

  // Increment the patch version
  packageJson.version = inc(latestVersion, 'patch');
  writeJsonFile(packageJsonPath, packageJson);

  return { success: true };
};

export default runExecutor;

async function execAsync(command: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout) => (error ? reject(error) : resolve(stdout)));
  });
}
