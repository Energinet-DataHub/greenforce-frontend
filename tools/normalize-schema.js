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
 * Normalize and sort the GraphQL schema SDL so that it is deterministic
 * across platforms (Windows/macOS/Linux).
 *
 * Previously this script tried to preserve the exact committed schema
 * (formatting + line endings) when the exported schema was semantically
 * identical. That approach depended on `git show` / `git checkout` and
 * still allowed the on-disk schema order to differ by platform.
 *
 * The new behaviour is:
 *   1. Read the current `schema.graphql` produced by HotChocolate export.
 *   2. Parse it with `graphql`.
 *   3. Apply `lexicographicSortSchema` to get a canonical ordering of
 *      types, fields, arguments, etc.
 *   4. Print back to SDL using `printSchema`.
 *   5. Overwrite `schema.graphql` with the canonical result using LF
 *      ("\n") line endings.
 *
 * This means the committed schema is now the *source of truth* for
 * schema changes, and its content/order is always platform independent.
 */

const { readFileSync, writeFileSync } = require('fs');
const { buildSchema, printSchema, lexicographicSortSchema } = require('graphql');

const schemaPath = 'libs/dh/shared/data-access-graphql/schema.graphql';

const exported = readFileSync(schemaPath, 'utf8');

// Normalize line endings to LF first so the parser sees a consistent input.
const exportedLf = exported.replace(/\r\n/g, '\n');

const schema = buildSchema(exportedLf);
const sorted = lexicographicSortSchema(schema);
const canonical = printSchema(sorted);

// Ensure LF line endings on disk for consistency across platforms.
writeFileSync(schemaPath, canonical.replace(/\r\n/g, '\n'));
