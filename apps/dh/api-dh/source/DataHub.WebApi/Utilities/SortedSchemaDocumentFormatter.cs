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

using HotChocolate.Language;

namespace Energinet.DataHub.WebApi.Utilities;

/// <summary>
/// Sorts fields within the root operation types (Query, Mutation, Subscription)
/// to ensure deterministic schema output across platforms.
/// </summary>
public class SortedSchemaDocumentFormatter : ISchemaDocumentFormatter
{
    private static readonly HashSet<string> OperationTypes = ["Query", "Mutation", "Subscription"];

    public DocumentNode Format(DocumentNode schemaDocument)
    {
        var sorted = schemaDocument.Definitions
            .Select(SortOperationFields)
            .ToList();

        return new DocumentNode(sorted);
    }

    private static IDefinitionNode SortOperationFields(IDefinitionNode def) => def switch
    {
        ObjectTypeDefinitionNode obj when OperationTypes.Contains(obj.Name.Value) =>
            obj.WithFields([.. obj.Fields.OrderBy(f => f.Name.Value, StringComparer.Ordinal)]),
        _ => def,
    };
}
