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

using System.Text;
using HotChocolate.Language;

namespace Energinet.DataHub.WebApi.Utilities;

/// <summary>
/// Provides deterministic GraphQL schema SDL output by sorting type definitions alphabetically,
/// ensuring the generated schema is identical regardless of the host platform.
/// </summary>
public static class SchemaExporter
{
    /// <summary>
    /// Parses <paramref name="sdl"/> and returns a new SDL string with all type definitions
    /// sorted alphabetically. The <c>schema</c> block is always emitted first, followed by
    /// directives and type definitions sorted alphabetically by name. Fields, enum values,
    /// input fields, and arguments within each type are also sorted alphabetically.
    /// </summary>
    /// <param name="sdl">The GraphQL SDL string to sort.</param>
    /// <returns>A sorted SDL string.</returns>
    public static string Sort(string sdl)
    {
        var document = Utf8GraphQLParser.Parse(sdl);

        var sortedDefinitions = document.Definitions
            .Select(SortDefinitionInternals)
            .OrderBy(GetSortKey, StringComparer.Ordinal)
            .ToList();

        return new DocumentNode(sortedDefinitions).ToString(true);
    }

    /// <summary>
    /// Sorts <paramref name="sdl"/> and writes the result to <paramref name="outputPath"/>,
    /// creating any missing directories.
    /// </summary>
    /// <param name="sdl">The GraphQL SDL string to sort.</param>
    /// <param name="outputPath">The file path to write the sorted SDL to.</param>
    public static void Write(string sdl, string outputPath)
    {
        var sorted = Sort(sdl);
        var directory = System.IO.Path.GetDirectoryName(outputPath);

        if (!string.IsNullOrEmpty(directory))
        {
            System.IO.Directory.CreateDirectory(directory);
        }

        System.IO.File.WriteAllText(outputPath, sorted, new UTF8Encoding(false));
    }

    private static string GetSortKey(IDefinitionNode definition) => definition switch
    {
        SchemaDefinitionNode => "0:",  // schema block always first
        DirectiveDefinitionNode directive => "1:" + directive.Name.Value,
        INamedSyntaxNode named => "1:" + named.Name.Value,
        _ => "2:",
    };

    /// <summary>
    /// Returns a new version of <paramref name="definition"/> with its internal collections
    /// (fields, enum values, input fields, arguments) sorted alphabetically.
    /// </summary>
    private static IDefinitionNode SortDefinitionInternals(IDefinitionNode definition) =>
        definition switch
        {
            ObjectTypeDefinitionNode obj => obj.WithFields(
                SortFields(obj.Fields)),

            ObjectTypeExtensionNode ext => ext.WithFields(
                SortFields(ext.Fields)),

            InterfaceTypeDefinitionNode iface => iface.WithFields(
                SortFields(iface.Fields)),

            InterfaceTypeExtensionNode ifaceExt => ifaceExt.WithFields(
                SortFields(ifaceExt.Fields)),

            InputObjectTypeDefinitionNode input => input.WithFields(
                input.Fields
                    .OrderBy(f => f.Name.Value, StringComparer.Ordinal)
                    .ToList()),

            InputObjectTypeExtensionNode inputExt => inputExt.WithFields(
                inputExt.Fields
                    .OrderBy(f => f.Name.Value, StringComparer.Ordinal)
                    .ToList()),

            EnumTypeDefinitionNode @enum => @enum.WithValues(
                @enum.Values
                    .OrderBy(v => v.Name.Value, StringComparer.Ordinal)
                    .ToList()),

            EnumTypeExtensionNode enumExt => enumExt.WithValues(
                enumExt.Values
                    .OrderBy(v => v.Name.Value, StringComparer.Ordinal)
                    .ToList()),

            DirectiveDefinitionNode directive => directive.WithArguments(
                directive.Arguments
                    .OrderBy(a => a.Name.Value, StringComparer.Ordinal)
                    .ToList()),

            _ => definition,
        };

    private static IReadOnlyList<FieldDefinitionNode> SortFields(
        IReadOnlyList<FieldDefinitionNode> fields) =>
        fields
            .Select(f => f.WithArguments(
                f.Arguments
                    .OrderBy(a => a.Name.Value, StringComparer.Ordinal)
                    .ToList()))
            .OrderBy(f => f.Name.Value, StringComparer.Ordinal)
            .ToList();
}
