"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const graphql_1 = require("graphql");
/** Gets the name of the type of a field */
function getName(field) {
    return (0, graphql_1.getNamedType)(field.type).name;
}
/* eslint-disable sonarjs/cognitive-complexity */
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
                    .find((name) => getName(fields[name]).endsWith('Connection') ||
                    getName(fields[name]).endsWith('CollectionSegment'));
                // The operation was not a "Connection" query
                if (!selectionName)
                    return null;
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
    }));
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
exports.plugin = plugin;
