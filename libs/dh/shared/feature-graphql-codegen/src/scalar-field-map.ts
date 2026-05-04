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
  isObjectType,
  isScalarType,
  isNonNullType,
  isListType,
  type GraphQLOutputType,
} from 'graphql';

const SCALAR_TYPES = new Set(['Date', 'DateTime', 'DateRange']);

/** Unwrap NonNull and List wrappers to get the named type. */
function unwrapType(type: GraphQLOutputType): GraphQLOutputType {
  if (isNonNullType(type) || isListType(type)) return unwrapType(type.ofType);
  return type;
}

const plugin: CodegenPlugin['plugin'] = (schema) => {
  const result = Object.fromEntries(
    Object.values(schema.getTypeMap())
      .filter(isObjectType)
      .filter((type) => !type.name.startsWith('__'))
      .flatMap((type) => {
        const fields = Object.values(type.getFields());
        const entries = fields.flatMap((field) => {
          const innerType = unwrapType(field.type);
          return isScalarType(innerType) && SCALAR_TYPES.has(innerType.name)
            ? [[field.name, innerType.name]]
            : [];
        });

        return entries.length ? [[type.name, Object.fromEntries(entries)]] : [];
      })
  );

  return `export const scalarFieldMap: Record<string, Record<string, string>> = ${JSON.stringify(result, null, 2)};\n`;
};

export { plugin };
