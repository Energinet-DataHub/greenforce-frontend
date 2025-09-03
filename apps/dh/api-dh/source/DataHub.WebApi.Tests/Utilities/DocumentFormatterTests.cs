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

public class DocumentFormatterTests
{
    [Fact]
    public void FormatDocumentIfNeeded_WithValidJson_ReturnsFormattedJson()
    {
        // Arrange
        var unformattedJson = """{"name":"test","value":123,"nested":{"key":"value"}}""";

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(unformattedJson);

        // Assert
        Assert.Contains("  \"name\": \"test\"", result);
        Assert.Contains("  \"value\": 123", result);
        Assert.Contains("  \"nested\": {", result);
        Assert.Contains("    \"key\": \"value\"", result);
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithValidJsonArray_ReturnsFormattedJson()
    {
        // Arrange
        var unformattedJson = """[{"id":1,"name":"first"},{"id":2,"name":"second"}]""";

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(unformattedJson);

        // Assert
        Assert.Contains("  {", result);
        Assert.Contains("    \"id\": 1", result);
        Assert.Contains("    \"name\": \"first\"", result);
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithValidXml_ReturnsFormattedXml()
    {
        // Arrange
        var unformattedXml = "<root><item id=\"1\"><name>test</name></item></root>";

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(unformattedXml);

        // Assert
        Assert.Contains("<root>", result);
        Assert.Contains("  <item id=\"1\">", result);
        Assert.Contains("    <name>test</name>", result);
        Assert.Contains("  </item>", result);
        Assert.Contains("</root>", result);
    }

    [Theory]
    [InlineData("{\"name\":\"test\",invalid}")]
    [InlineData("<root><unclosed>")]
    [InlineData("This is just plain text, not JSON or XML")]
    [InlineData("123.45")]
    [InlineData("true")]
    public void FormatDocumentIfNeeded_WithNonFormattableContent_ReturnsOriginal(string input)
    {
        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(input);

        // Assert
        Assert.Equal(input, result);
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithEmptyString_ReturnsEmptyString()
    {
        // Arrange
        var empty = string.Empty;

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(empty);

        // Assert
        Assert.Equal(empty, result);
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithNull_ReturnsNull()
    {
        // Arrange
        string? nullDocument = null;

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(nullDocument!);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithWhitespace_ReturnsWhitespace()
    {
        // Arrange
        var whitespace = "   ";

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(whitespace);

        // Assert
        Assert.Equal(whitespace, result);
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithXmlDeclaration_PreservesDeclaration()
    {
        // Arrange
        var xmlWithDeclaration = """<?xml version="1.0" encoding="utf-8"?><root><item>test</item></root>""";

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(xmlWithDeclaration);

        // Assert
        Assert.StartsWith("<?xml version=\"1.0\" encoding=\"utf-8\"?>", result);
        Assert.Contains("<root>", result);
        Assert.Contains("  <item>test</item>", result);
        Assert.Contains("</root>", result);
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithJsonStartingWithWhitespace_FormatsCorrectly()
    {
        // Arrange
        var jsonWithLeadingSpace = "   {\"key\":\"value\"}";

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(jsonWithLeadingSpace);

        // Assert
        // Check for platform-specific newlines
        Assert.True(
            result.Contains("{\n  \"key\": \"value\"\n}") || result.Contains("{\r\n  \"key\": \"value\"\r\n}"),
            "Expected formatted JSON with indentation");
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithXmlStartingWithWhitespace_FormatsCorrectly()
    {
        // Arrange
        var xmlWithLeadingSpace = "   <root><item>test</item></root>";

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(xmlWithLeadingSpace);

        // Assert
        Assert.Contains("<root>", result);
        Assert.Contains("  <item>test</item>", result);
    }

    [Fact]
    public void FormatDocumentIfNeeded_WithUnformattedJsonButContainsNewline_StillFormats()
    {
        // Arrange
        var jsonWithNewlineInValue = "{\"message\":\"Hello\\nWorld\",\"value\":123}";

        // Act
        var result = DocumentFormatter.FormatDocumentIfNeeded(jsonWithNewlineInValue);

        // Assert
        Assert.NotEqual(jsonWithNewlineInValue, result);
        // Check for platform-specific newlines
        Assert.True(
            result.Contains("{\n  \"message\":") || result.Contains("{\r\n  \"message\":"),
            "Expected formatted JSON with indentation");
    }
}
