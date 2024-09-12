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
                const queryType = `${name}Query`;
                const variablesType = `${name}QueryVariables`;
                const nodeType = `NonNullable<NonNullable<${queryType}['${selectionName}']>['nodes']>[number]`;
                // prettier-ignore
                const lines = [
                    `export class ${name}DataSource extends ApolloDataSource<${queryType}, ${variablesType}, ${nodeType}> {`,
                    `constructor(options?: QueryOptions<${variablesType}>) {`,
                    `super(${name}Document, data => data.${selectionName}, options);`,
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
            "import { ApolloDataSource, QueryOptions } from '@energinet-datahub/dh/shared/util-apollo'",
        ],
        content: result
            .flatMap((node) => node.definitions)
            .filter((def) => def !== null)
            .join('\n'),
    };
};
exports.plugin = plugin;
