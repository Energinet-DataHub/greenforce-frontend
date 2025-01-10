"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const graphql_1 = require("graphql");
var PageableType;
(function (PageableType) {
    PageableType["Connection"] = "Connection";
    PageableType["CollectionSegment"] = "CollectionSegment";
})(PageableType || (PageableType = {}));
/** Gets the PageableType for a field or null if the field is not pageable. */
const getPageableType = (field) => Object.values(PageableType).find((type) => (0, graphql_1.getNamedType)(field.type).name.endsWith(type.toString()));
/** Returns the first pageable field found by recursively searching the selections. */
const findPageable = (fields, selections = [], base = []) => {
    var _a;
    for (const selection of selections) {
        // Skip non-fields, this may not work for inline fragments
        if (selection.kind !== 'Field')
            continue;
        const name = selection.name.value;
        const path = [...base, name];
        const field = fields[name];
        const type = (0, graphql_1.getNullableType)(field.type);
        if (!(0, graphql_1.isObjectType)(type))
            continue;
        switch (getPageableType(field)) {
            case PageableType.Connection:
                return { kind: PageableType.Connection, path, listName: 'nodes' };
            case PageableType.CollectionSegment:
                return { kind: PageableType.CollectionSegment, path, listName: 'items' };
            default: {
                const nested = findPageable(type.getFields(), (_a = selection.selectionSet) === null || _a === void 0 ? void 0 : _a.selections, path);
                if (nested)
                    return nested;
            }
        }
    }
    return null; // No pageable field found
};
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
                // Recursively look for a pageable field
                const fields = queryObjectType.getFields();
                const pageable = findPageable(fields, node.selectionSet.selections);
                // The operation did not contain a "pageable" field
                if (!pageable)
                    return null;
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
