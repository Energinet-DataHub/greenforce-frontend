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
import { type CodegenPlugin } from '@graphql-codegen/plugin-helpers';
import { visit, getNamedType, GraphQLField } from 'graphql';

/** Gets the name of the type of a field */
function getName(field: GraphQLField<unknown, unknown, unknown>) {
  return getNamedType(field.type).name;
}

/* eslint-disable sonarjs/cognitive-complexity */
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

            const fields = queryObjectType.getFields();
            const selectionName = node.selectionSet.selections
              .filter((selection) => selection.kind === 'Field')
              .map((selection) => selection.name.value)
              .find(
                (name) =>
                  getName(fields[name]).endsWith('Connection') ||
                  getName(fields[name]).endsWith('CollectionSegment')
              );

            // The operation was not a "Connection" query
            if (!selectionName) return null;

            const isConnection = getName(fields[selectionName]).endsWith('Connection');
            const dataSource = isConnection
              ? 'ConnectionDataSource'
              : 'CollectionSegmentDataSource';

            const path = isConnection ? 'nodes' : 'items';
            const queryType = `Types.${name}Query`;
            const variablesType = `Types.${name}QueryVariables`;
            const nodeType = `NonNullable<NonNullable<${queryType}['${selectionName}']>['${path}']>[number]`;

            // prettier-ignore
            const lines = [
              `export class ${name}DataSource extends ${dataSource}<${queryType}, ${variablesType}, ${nodeType}> {`,
                `constructor(options?: QueryOptions<${variablesType}>) {`,
                  `super(Types.${name}Document, data => data.${selectionName}, options);`,
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
