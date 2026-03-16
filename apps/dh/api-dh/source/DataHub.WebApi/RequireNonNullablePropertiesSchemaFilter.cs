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

using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Energinet.DataHub.WebApi;

public class RequireNonNullablePropertiesSchemaFilter : ISchemaFilter
{
    /// <summary>
    /// Add to model.Required all properties where Nullable is false.
    /// </summary>
    public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
    {
        if (schema.Properties == null || !schema.Properties.Any())
        {
            return;
        }

        var additionalRequiredProps = schema.Properties
            .Where(x => !(x.Value.Type?.HasFlag(JsonSchemaType.Null) ?? false) && !(schema.Required?.Contains(x.Key) ?? false))
            .Select(x => x.Key);

        foreach (var propKey in additionalRequiredProps)
        {
            schema.Required!.Add(propKey);
        }
    }
}
