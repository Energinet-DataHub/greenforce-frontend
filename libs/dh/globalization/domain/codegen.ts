import { join, relative } from 'path';
import { mkdirSync, globSync, readFileSync, writeFileSync } from 'fs';
import { format, resolveConfig } from 'prettier';

import { names, normalizePath } from '@nx/devkit';
import { Result } from 'typescript-result';

const OUTPUT_DIR = 'libs/dh/globalization/domain/src/generated/i18n';

function flattenKeys(obj: unknown, path = ''): string[] {
  if (typeof obj !== 'object') return [path];
  if (obj === null) return [];
  return Object.entries(obj).flatMap(([k, v]) => flattenKeys(v, path ? `${path}.${k}` : k));
}

function generateType(obj: unknown): string {
  if (typeof obj !== 'object') return typeof obj;
  if (obj === null) return 'null';
  const types = Object.entries(obj).map(([k, v]) => `'${k}': ${generateType(v)};`);
  return `{ ${types.join('')} }`;
}

function generateProvider(name: string, folder: string) {
  const i18nPath = normalizePath(relative(OUTPUT_DIR, folder));
  return `
    export const ${name}TranslocoScope = [
      provideTranslocoScope({
        scope: '${name}',
        loader: {
          da: () => import('${i18nPath}/da.json'),
          en: () => import('${i18nPath}/en.json'),
        },
      }),
    ];
  `;
}

async function saveFile(path: string, content: string) {
  const config = await resolveConfig(path, { editorconfig: true });
  writeFileSync(path, await format(content, { ...config, filepath: path }));
}

export async function main() {
  const translations = globSync('libs/dh/*/i18n/da.json').map((daPath) => {
    const parts = daPath.split('/');
    const domain = parts[2];
    const folder = parts.slice(0, -1).join('/');
    const enPath = join(folder, 'en.json');

    return {
      domain,
      folder,
      files: [daPath, enPath].map((f) => {
        try {
          return Result.ok({ path: f, json: JSON.parse(readFileSync(f, 'utf-8')) });
        } catch {
          return Result.error(`Missing file "${f}"`);
        }
      }),
    };
  });

  const scopes = translations
    .filter((s) => s.files.every((r) => r.ok))
    .sort((a, b) => a.domain.localeCompare(b.domain))
    .map((s) => {
      const [da, en] = s.files.map((f) => f.value.json as Record<string, unknown>);
      const diff = [da, en]
        .map((json) => flattenKeys(json))
        .map((keys) => new Set(keys))
        .reduce((a, b) => a.symmetricDifference(b));

      return diff.size
        ? Result.error({ name: s.domain, keys: [...diff] })
        : Result.ok({ name: s.domain, folder: s.folder, json: da });
    });

  const defs = scopes
    .filter((s) => s.ok)
    .map((s) => s.value)
    .map((s) => ({
      name: s.name,
      folder: s.folder,
      typeName: `${names(s.name).className}Translation`,
      type: generateType(s.json),
    }));

  const types = `
    ${defs.map((d) => `export type ${d.typeName} = ${d.type};`).join('')}

    export interface TranslationScopeMap {
      ${defs.map((d) => `'${d.name}': ${d.typeName};`).join('')}
    }
  `;

  const providers = `
    import { provideTranslocoScope } from '@jsverse/transloco'
    ${defs.map((d) => generateProvider(d.name, d.folder)).join('')}
  `;

  mkdirSync(OUTPUT_DIR, { recursive: true });
  await saveFile(join(OUTPUT_DIR, 'types.ts'), types);
  await saveFile(join(OUTPUT_DIR, 'providers.ts'), providers);

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

  if (fileErrors.length || scopeErrors.length) {
    process.exit(1);
  }
}

main();
