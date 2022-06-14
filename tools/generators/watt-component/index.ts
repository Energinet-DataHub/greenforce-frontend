import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  Tree,
} from '@nrwl/devkit';

export default async function (host: Tree, schema: { name: string }) {
  const substitutions = names(schema.name);
  generateFiles(
    host,
    joinPathFragments(__dirname, './files'),
    `./libs/ui-watt/src/lib/components/${substitutions.fileName}`,
    { tmpl: '', ...substitutions }
  );

  const wattIndexFile = './libs/ui-watt/src/index.ts';
  const contents = host.read(wattIndexFile);
  host.write(
    wattIndexFile,
    `${contents}export * from './lib/components/${substitutions.fileName}';\n`
  );

  await formatFiles(host);
}
