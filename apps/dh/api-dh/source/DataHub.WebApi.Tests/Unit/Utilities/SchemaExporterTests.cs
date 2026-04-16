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
using Energinet.DataHub.WebApi.Utilities;
using FluentAssertions;
using HotChocolate.Language;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Unit.Utilities;

public class SchemaExporterTests
{
    [Fact]
    public void Sort_SchemaBlockIsAlwaysFirst()
    {
        var sdl = """
            directive @foo on FIELD_DEFINITION
            type Query { dummy: String }
            schema { query: Query }
            """;

        var result = SchemaExporter.Sort(sdl);

        var document = Utf8GraphQLParser.Parse(result);
        document.Definitions[0].Should().BeOfType<SchemaDefinitionNode>();
    }

    [Fact]
    public void Sort_TypeDefinitionsAreSortedAlphabetically()
    {
        var sdl = """
            schema { query: Zebra }
            type Zebra { dummy: String }
            type Apple { dummy: String }
            type Mango { dummy: String }
            """;

        var result = SchemaExporter.Sort(sdl);

        var document = Utf8GraphQLParser.Parse(result);
        var typeNames = document.Definitions
            .OfType<ObjectTypeDefinitionNode>()
            .Select(d => d.Name.Value)
            .ToList();

        typeNames.Should().BeInAscendingOrder(StringComparer.Ordinal);
    }

    [Fact]
    public void Sort_DirectiveDefinitionsAreSortedAlphabetically()
    {
        var sdl = """
            directive @zoo on FIELD_DEFINITION
            directive @alpha on FIELD_DEFINITION
            directive @beta on FIELD_DEFINITION
            schema { query: Query }
            type Query { dummy: String }
            """;

        var result = SchemaExporter.Sort(sdl);

        var document = Utf8GraphQLParser.Parse(result);
        var directiveNames = document.Definitions
            .OfType<DirectiveDefinitionNode>()
            .Select(d => d.Name.Value)
            .ToList();

        directiveNames.Should().BeInAscendingOrder(StringComparer.Ordinal);
    }

    [Fact]
    public void Sort_SchemaBlockBeforeDirectivesAndTypes()
    {
        var sdl = """
            directive @auth on FIELD_DEFINITION
            type Query { dummy: String }
            type Mutation { dummy: String }
            schema { query: Query mutation: Mutation }
            """;

        var result = SchemaExporter.Sort(sdl);

        var document = Utf8GraphQLParser.Parse(result);
        document.Definitions[0].Should().BeOfType<SchemaDefinitionNode>(
            "schema block must always be emitted first");
    }

    [Fact]
    public void Sort_IsDeterministic()
    {
        var sdl = """
            type Zebra { dummy: String }
            directive @foo on FIELD_DEFINITION
            schema { query: Zebra }
            type Apple { dummy: String }
            """;

        var first = SchemaExporter.Sort(sdl);
        var second = SchemaExporter.Sort(sdl);

        first.Should().Be(second);
    }
}
