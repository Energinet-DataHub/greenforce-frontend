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
/// Utility for exporting GraphQL schema SDL in a deterministic, sorted format.
/// </summary>
public static class SchemaExporter
{
    /// <summary>
    /// Parses the given SDL, sorts all type definitions alphabetically and sorts
    /// the members (fields, enum values) within each type, then returns the
    /// re-printed SDL. This ensures a stable, diff-friendly schema file.
    /// </summary>
    public static string SortSdl(string sdl)
    {
        var document = Utf8GraphQLParser.Parse(sdl);
        var sorted = SortDocument(document);
        return sorted.ToString(indented: true);
    }

    private static DocumentNode SortDocument(DocumentNode document)
    {
        // Keep schema definitions (the `schema { }` block) first, then sort
        // all named type definitions alphabetically.
        var schemaFirst = document.Definitions
            .Where(d => d is SchemaDefinitionNode or SchemaExtensionNode);

        var namedSorted = document.Definitions
            .OfType<INamedSyntaxNode>()
            .OrderBy(d => d.Name.Value, StringComparer.Ordinal)
            .Cast<IDefinitionNode>()
            .Select(SortMembers);

        var rest = document.Definitions
            .Where(d => d is not SchemaDefinitionNode
                     && d is not SchemaExtensionNode
                     && d is not INamedSyntaxNode);

        return document.WithDefinitions(
        [
            .. schemaFirst,
            .. namedSorted,
            .. rest,
        ]);
    }

    private static IDefinitionNode SortMembers(IDefinitionNode def) => def switch
    {
        ObjectTypeDefinitionNode obj => obj.WithFields(
            [.. obj.Fields.OrderBy(f => f.Name.Value, StringComparer.Ordinal)]),

        ObjectTypeExtensionNode ext => ext.WithFields(
            [.. ext.Fields.OrderBy(f => f.Name.Value, StringComparer.Ordinal)]),

        InterfaceTypeDefinitionNode iface => iface.WithFields(
            [.. iface.Fields.OrderBy(f => f.Name.Value, StringComparer.Ordinal)]),

        InputObjectTypeDefinitionNode input => input.WithFields(
            [.. input.Fields.OrderBy(f => f.Name.Value, StringComparer.Ordinal)]),

        EnumTypeDefinitionNode @enum => @enum.WithValues(
            [.. @enum.Values.OrderBy(v => v.Name.Value, StringComparer.Ordinal)]),

        _ => def,
    };
}

