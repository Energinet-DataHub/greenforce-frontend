// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System;
using System.Linq;
using System.Reflection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Energinet.DataHub.WebApi
{
    public class RequireNonNullablePropertiesSchemaFilter : ISchemaFilter
    {
        /// <summary>
        /// Add to model.Required all properties where Nullable is false.
        /// </summary>
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (schema.Properties == null || !schema.Properties.Any())
            {
                return;
            }

            FixNullableProperties(schema, context);

            var additionalRequiredProps = schema.Properties
                .Where(x => !x.Value.Nullable && !schema.Required.Contains(x.Key))
                .Select(x => x.Key);

            foreach (var propKey in additionalRequiredProps)
            {
                schema.Required.Add(propKey);
            }
        }

        /// <summary>
        /// Option "SupportNonNullableReferenceTypes" not working with complex types ({ "type": "object" }),
        /// so they always have "Nullable = false",
        /// see method "SchemaGenerator.GenerateSchemaForMember"
        /// </summary>
        private static void FixNullableProperties(OpenApiSchema schema, SchemaFilterContext context)
        {
            foreach (var (key, value) in schema.Properties)
            {
                if (value.Reference == null)
                {
                    continue;
                }

                var field = context.Type
                    .GetMembers(BindingFlags.Public | BindingFlags.Instance)
                    .FirstOrDefault(x =>
                        string.Equals(x.Name, key, StringComparison.InvariantCultureIgnoreCase));

                if (field == null)
                {
                    continue;
                }

                var fieldType = field switch
                {
                    FieldInfo fieldInfo => fieldInfo.FieldType,
                    PropertyInfo propertyInfo => propertyInfo.PropertyType,
                    _ => throw new NotSupportedException(),
                };

                value.Nullable = fieldType.IsValueType
                    ? Nullable.GetUnderlyingType(fieldType) != null
                    : !field.IsNonNullableReferenceType();
            }
        }
    }
}
