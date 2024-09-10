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
      let sortInputType = null;

      node.selectionSet.selections.forEach((selection) => {
        if (selection.kind === 'Field') {
          const rootFieldType = getNamedType(
            this.schema.getQueryType().getFields()[selection.name.value].type
          );
          hasConnection = isConnectionType(rootFieldType.name);
          if (hasConnection) {
            selectionName = selection.name.value;
            nodeType = `NonNullable<NonNullable<${queryName}Query['${selectionName}']>['nodes']>[number]`;
          }
        }
      });

      if (hasConnection) {
        node.variableDefinitions.forEach((variable) => {
          if (variable.variable.name.value === 'order') {
            sortInputType = variable.type.type.type.name.value;
          }
        });
        // Return the class string
        return `export class ${queryName}DataSource extends ApolloDataSource<${queryName}Query, ${sortInputType}, ${queryName}QueryVariables, ${nodeType}> { constructor(options?: QueryOptions<${queryName}QueryVariables>) { super(${queryName}Document, data => data.${selectionName}, options); } }`;
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
