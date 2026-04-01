//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
/**
 * Preserves the committed schema.graphql when the export is semantically identical.
 *
 * HotChocolate's `schema export` can produce fields in a different order on
 * Windows vs macOS (due to source-generator / file-system enumeration ordering),
 * and uses platform-specific line endings (CRLF on Windows, LF on macOS).
 *
 * This script:
 *   1. Reads the freshly exported schema (written by `dotnet exec ... schema export`).
 *   2. Reads the previously committed version from git.
 *   3. Compares both semantically (by sorting and printing in canonical form).
 *   4. If identical → restores the committed version via `git checkout` (preserving exact formatting and line endings).
 *   5. If different → keeps the new export (with LF line endings).
 */
const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { buildSchema, printSchema, lexicographicSortSchema } = require('graphql');

const schemaPath = 'libs/dh/shared/data-access-graphql/schema.graphql';

const exported = readFileSync(schemaPath, 'utf8');

let committed;
try {
  committed = execSync(`git show HEAD:${schemaPath}`, { encoding: 'utf8' });
} catch {
  // No committed version (new file) — just normalize line endings
  writeFileSync(schemaPath, exported.replace(/\r\n/g, '\n'));
  process.exit(0);
}

const toCanonical = (sdl) => printSchema(lexicographicSortSchema(buildSchema(sdl)));

if (toCanonical(exported) === toCanonical(committed)) {
  // Semantically identical — restore the committed version exactly as git would check it out
  execSync(`git checkout HEAD -- ${schemaPath}`);
} else {
  // Schema actually changed — keep the new export with LF line endings
  writeFileSync(schemaPath, exported.replace(/\r\n/g, '\n'));
}
