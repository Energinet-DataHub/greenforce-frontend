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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const graphql_1 = require("graphql");
const plugin = (schema, documents) => {
    const result = documents
        .map((d) => d.document)
        .filter((d) => d !== undefined)
        .map((d) => (0, graphql_1.visit)(d, {
        FragmentDefinition: () => null,
        OperationDefinition: {
            leave(node) {
                var _a;
                // No need to proces mutations or subscriptions
                if (node.operation !== 'query')
                    return null;
                // Must be a named query in order to derive data source name
                if (!((_a = node.name) === null || _a === void 0 ? void 0 : _a.value))
                    return null;
                // Pagination and sorting requires variables
                if (!node.variableDefinitions)
                    return null;
                const name = node.name.value;
                const queryObjectType = schema.getQueryType();
                // Make TS happy (schema should always have a query type here)
                if (!queryObjectType)
                    return null;
                const fields = queryObjectType.getFields();
                const selectionName = node.selectionSet.selections
                    .filter((selection) => selection.kind === 'Field')
                    .map((selection) => selection.name.value)
                    .find((name) => (0, graphql_1.getNamedType)(fields[name].type).name.endsWith('Connection'));
                // The operation was not a "Connection" query
                if (!selectionName)
                    return null;
                const queryType = `Types.${name}Query`;
                const variablesType = `Types.${name}QueryVariables`;
                const nodeType = `NonNullable<NonNullable<${queryType}['${selectionName}']>['nodes']>[number]`;
                // prettier-ignore
                const lines = [
                    `export class ${name}DataSource extends ApolloDataSource<${queryType}, ${variablesType}, ${nodeType}> {`,
                    `constructor(options?: QueryOptions<${variablesType}>) {`,
                    `super(Types.${name}Document, data => data.${selectionName}, options);`,
                    `}`,
                    `}`,
                ];
                // Inline the class definition
                return lines.join(' ');
            },
        },
    }));
    return {
        prepend: [
            "import * as Types from './types'",
            "import { ApolloDataSource, QueryOptions } from '@energinet-datahub/dh/shared/util-apollo'",
        ],
        content: result
            .flatMap((node) => node.definitions)
            .filter((def) => def !== null)
            .join('\n'),
    };
};
exports.plugin = plugin;
