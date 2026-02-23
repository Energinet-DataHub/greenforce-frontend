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
import { type CodegenPlugin } from '@graphql-codegen/plugin-helpers';
import {
  visit,
  getNamedType,
  isObjectType,
  GraphQLFieldMap,
  SelectionNode,
  GraphQLField,
  getNullableType,
} from 'graphql';

enum PageableType {
  Connection = 'Connection',
  CollectionSegment = 'CollectionSegment',
}

type Pageable = { kind: PageableType; path: string[]; listName: string };

/** Gets the PageableType for a field or null if the field is not pageable. */
const getPageableType = (field: GraphQLField<unknown, unknown>) =>
  Object.values(PageableType).find((type) =>
    getNamedType(field.type).name.endsWith(type.toString())
  );

/** Returns the first pageable field found by recursively searching the selections. */
const findPageable = (
  fields: GraphQLFieldMap<unknown, unknown>,
  selections: readonly SelectionNode[] = [],
  base: readonly string[] = []
): Pageable | null => {
  for (const selection of selections) {
    // Skip non-fields, this may not work for inline fragments
    if (selection.kind !== 'Field') continue;

    const name = selection.name.value;
    const path = [...base, name];
    const field = fields[name];
    const type = getNullableType(field.type);

    if (!isObjectType(type)) continue;

    switch (getPageableType(field)) {
      case PageableType.Connection:
        return { kind: PageableType.Connection, path, listName: 'nodes' };
      case PageableType.CollectionSegment:
        return { kind: PageableType.CollectionSegment, path, listName: 'items' };
      default: {
        const nested = findPageable(type.getFields(), selection.selectionSet?.selections, path);
        if (nested) return nested;
      }
    }
  }

  return null; // No pageable field found
};

const plugin: CodegenPlugin['plugin'] = (schema, documents) => {
  const result = documents
    .map((d) => d.document)
    .filter((d) => d !== undefined)
    .map((d) =>
      visit(d, {
        FragmentDefinition: () => null,
        OperationDefinition: {
          leave(node) {
            // No need to proces mutations or subscriptions
            if (node.operation !== 'query') return null;

            // Must be a named query in order to derive data source name
            if (!node.name?.value) return null;

            // Pagination and sorting requires variables
            if (!node.variableDefinitions) return null;

            const name = node.name.value;
            const queryObjectType = schema.getQueryType();

            // Make TS happy (schema should always have a query type here)
            if (!queryObjectType) return null;

            // Recursively look for a pageable field
            const fields = queryObjectType.getFields();
            const pageable = findPageable(fields, node.selectionSet.selections);

            // The operation did not contain a "pageable" field
            if (!pageable) return null;

            const queryType = `Types.${name}Query`;
            const selector = pageable.path.join('?.');
            const typePath = pageable.path.reduce((t, f) => `NonNullable<${t}['${f}']>`, queryType);
            const variablesType = `Types.${name}QueryVariables`;
            const nodeType = `NonNullable<${typePath}['${pageable.listName}']>[number]`;

            // prettier-ignore
            const lines = [
              `export class ${name}DataSource extends ${pageable.kind}DataSource<${queryType}, ${variablesType}, ${nodeType}> {`,
                `constructor(options?: QueryOptions<${variablesType}>) {`,
                  `super(Types.${name}Document, data => data.${selector}, options);`,
                `}`,
              `}`,
            ];

            // Inline the class definition
            return lines.join(' ');
          },
        },
      })
    );

  return {
    prepend: [
      "import * as Types from './types'",
      "import { ConnectionDataSource, CollectionSegmentDataSource, QueryOptions } from '@energinet-datahub/dh/shared/util-apollo'",
    ],
    content: result
      .flatMap((node) => node.definitions)
      .filter((def) => def !== null)
      .join('\n'),
  };
};

export { plugin };
