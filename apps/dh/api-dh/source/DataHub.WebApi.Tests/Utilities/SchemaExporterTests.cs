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

using Energinet.DataHub.WebApi.Utilities;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Utilities;

public class SchemaExporterTests
{
    [Fact]
    public void NormalizeSdl_WithCrlfLineEndings_ReturnsLfOnly()
    {
        // Arrange
        var sdl = "type Query {\r\n  hello: String\r\n}\r\n";

        // Act
        var result = SchemaExporter.NormalizeSdl(sdl);

        // Assert
        Assert.DoesNotContain("\r\n", result);
        Assert.Contains("\n", result);
    }

    [Fact]
    public void NormalizeSdl_WithLfLineEndings_IsUnchanged()
    {
        // Arrange
        var sdl = "type Query {\n  hello: String\n}\n";

        // Act
        var result = SchemaExporter.NormalizeSdl(sdl);

        // Assert
        Assert.Equal(sdl, result);
    }

    [Fact]
    public void NormalizeSdl_IsIdempotent()
    {
        // Arrange — mix of CRLF and LF
        var sdl = "type Query {\r\n  hello: String\n  world: Int\r\n}\n";

        // Act — applying twice should produce the same result
        var once = SchemaExporter.NormalizeSdl(sdl);
        var twice = SchemaExporter.NormalizeSdl(once);

        // Assert
        Assert.Equal(once, twice);
    }

    [Fact]
    public void NormalizeSdl_PreservesSchemaContent()
    {
        // Arrange
        var sdl = "type Query {\r\n  zebra: String\r\n  apple: Int\r\n}\r\n";

        // Act
        var result = SchemaExporter.NormalizeSdl(sdl);

        // Assert — field names must survive normalization unchanged
        Assert.Contains("zebra: String", result);
        Assert.Contains("apple: Int", result);
    }
}
