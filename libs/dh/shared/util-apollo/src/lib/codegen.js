const { oldVisit } = require('@graphql-codegen/plugin-helpers');
const { BaseVisitor } = require('@graphql-codegen/visitor-plugin-common');
const { getNamedType } = require('graphql');

/**
 * Check if a given GraphQL type name ends with "Connection".
 *
 * @param {string} typeName - The GraphQL type name.
 * @returns {boolean} - True if the type name ends with "Connection", otherwise false.
 */
function isConnectionType(typeName) {
  return typeName.endsWith('Connection');
}

class MyPluginVisitor extends BaseVisitor {
  constructor(rawConfig) {
    super(rawConfig, {});
    this.schema = null;
  }

  setSchema(schema) {
    this.schema = schema;
  }

  // Extend the visitor methods as needed for your use case
  // eslint-disable-next-line sonarjs/cognitive-complexity
  OperationDefinition(node) {
    if (node.operation === 'query') {
      const queryName = node.name?.value;
      if (!queryName) return null;

      let hasConnection = false;
      let nodeType = null;
      let selectionName = null;

      node.selectionSet.selections.forEach((selection) => {
        if (selection.kind === 'Field') {
          const rootFieldType = getNamedType(
            this.schema.getQueryType().getFields()[selection.name.value].type
          );
          hasConnection = isConnectionType(rootFieldType.name);
          if (hasConnection) {
            selectionName = selection.name.value;
            const nodesField = rootFieldType.getFields()['nodes'];
            nodeType = getNamedType(nodesField.type).name;
          }
        }
      });

      if (hasConnection) {
        // Return the class string
        return `export class ${queryName}DataSource extends ApolloDataSource<${queryName}Query, ${queryName}QueryVariables, ${nodeType}> { constructor(options?: QueryOptions<${queryName}QueryVariables>) { super(${queryName}Document, data => data.${selectionName}, options); } }`;
      }
    }

    return null;
  }

  FragmentDefinition() {
    // Explicitly handle FragmentDefinition and ignore it
    return null;
  }
}

const plugin = function (schema, documents, config) {
  const visitor = new MyPluginVisitor(config);
  visitor.setSchema(schema);

  const result = documents
    .flatMap((doc) => oldVisit(doc.document, { leave: visitor }).definitions)
    .filter((def) => def !== undefined && def !== null);

  return {
    prepend: [
      "import { ApolloDataSource, QueryOptions } from '@energinet-datahub/dh/shared/util-apollo'",
    ],
    content: result.join('\n'),
  };
};

module.exports = {
  plugin,
  default: plugin,
};
