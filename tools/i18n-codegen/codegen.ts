import { join, relative } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { format, resolveConfig } from 'prettier';
import { flatten } from '@jsverse/transloco';
import { createProjectGraphAsync, names, normalizePath, readJsonFile } from '@nx/devkit';
import { Result } from 'typescript-result';

const OUTPUT_DIR = 'libs/dh/shared/domain/src/generated/i18n';

// --- Helpers ---
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const generateInterfaceType = (obj: Record<string, unknown>): string =>
  [
    '{',
    ...Object.entries(obj).map(([key, value]) =>
      isRecord(value) ? `'${key}': ${generateInterfaceType(value)};` : `'${key}': string;`
    ),
    '}',
  ].join('\n');

const generateScopeProvider = (scope: { name: string; folder: string }): string => {
  const i18nPath = normalizePath(relative(OUTPUT_DIR, scope.folder));
  const n = names(scope.name).propertyName;
  return `
    export const ${n}TranslocoScope = [
      provideTranslocoScope({
        scope: '${scope.name}',
        loader: {
          da: () => import('${i18nPath}/da.json'),
          en: () => import('${i18nPath}/en.json'),
        },
      }),
    ];
  `;
};

function generate(scopes: { name: string; folder: string; json: Record<string, unknown> }[]) {
  const typeDeclarations = scopes
    .map((scope) => {
      const typeName = names(scope.name).className + 'Translation';
      return `export type ${typeName} = ${generateInterfaceType(scope.json)};\n`;
    })
    .join('\n');

  const scopeMapEntries = scopes
    .map((scope) => `  '${scope.name}': ${names(scope.name).className}Translation;`)
    .join('\n');

  const types = `${typeDeclarations}\nexport interface TranslationScopeMap {\n${scopeMapEntries}\n}\n`;
  const providers = [
    "import { provideTranslocoScope, Translation } from '@jsverse/transloco';",
    '',
    ...scopes.map((scope) => generateScopeProvider(scope)),
    '',
  ].join('\n');

  return { types, providers };
}

async function saveFile(path: string, content: string) {
  const config = await resolveConfig(path, { editorconfig: true });
  writeFileSync(path, await format(content, { ...config, filepath: path }));
}

export async function main() {
  const graph = await createProjectGraphAsync();
  const translations = Object.values(graph.nodes)
    .map((n) => ({ project: n.name, folder: join(n.data.root, `src/i18n`) }))
    .filter(({ folder }) => existsSync(folder))
    .map(({ project, folder }) => ({
      project,
      folder,
      files: ['da', 'en']
        .map((lang) => join(folder, `${lang}.json`))
        .map((f) => (existsSync(f) ? Result.ok(f) : Result.error(`Missing file "${f}"`))),
    }));

  const scopes = translations
    .filter((s) => s.files.every((r) => r.ok))
    .sort((a, b) => a.project.localeCompare(b.project))
    .map((s) => {
      const [da, en] = s.files.map((f) => readJsonFile<Record<string, unknown>>(f.value));
      const diff = [da, en]
        .map((json) => Object.keys(flatten(json)))
        .map((keys) => new Set(keys))
        .reduce((da, en) => da.symmetricDifference(en));

      return diff.size
        ? Result.error({ name: s.project, keys: [...diff] })
        : Result.ok({ name: s.project, folder: s.folder, json: da });
    });

  // Generate code
  const { types, providers } = generate(scopes.filter((s) => s.ok).map((s) => s.value));
  mkdirSync(OUTPUT_DIR, { recursive: true });
  saveFile(join(OUTPUT_DIR, 'types.ts'), types);
  saveFile(join(OUTPUT_DIR, 'providers.ts'), providers);

  // Handle file errors
  const fileErrors = translations
    .flatMap((scope) => scope.files)
    .filter((file) => !file.ok)
    .map((file) => file.error);

  fileErrors.forEach((error) => console.warn(`⚠️ ${error}`));

  // Handle scope errors
  const scopeErrors = scopes.filter((s) => !s.ok).map((s) => s.error);
  scopeErrors.forEach((s) => {
    console.error(`🚨 Translation key mismatch found in "${s.name}"`);
    s.keys
      .map((k) => `Key "${k}" is not in both da.json and en.json`)
      .forEach((error) => console.error(`  ❌ ${error}`));
  });

  // process.exit (if strict, then error if any errors)
}
