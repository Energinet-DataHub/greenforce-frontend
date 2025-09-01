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

using System.Text.Json;
using System.Xml.Linq;

namespace Energinet.DataHub.WebApi.Utilities;

public static class DocumentFormatter
{
    private const int MaxDocumentSizeForFormatting = 100 * 1024 * 1024; // 100 MB - safely handles 50MB documents

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = true,
        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.Never,
        PropertyNamingPolicy = null,
    };

    public static string FormatDocumentIfNeeded(string document)
    {
        if (string.IsNullOrWhiteSpace(document))
        {
            return document;
        }

        if (document.Length > MaxDocumentSizeForFormatting)
        {
            return document;
        }

        if (TryFormatJson(document, out var formattedJson))
        {
            return formattedJson;
        }

        if (TryFormatXml(document, out var formattedXml))
        {
            return formattedXml;
        }

        return document;
    }

    private static bool IsAlreadyFormatted(string input)
    {
        // Single scan to check for newline followed by indentation
        var i = 0;
        while (i < input.Length - 1)
        {
            if (input[i] == '\n')
            {
                // Check the character after the newline
                var nextChar = input[i + 1];
                if (nextChar == ' ' || nextChar == '\t')
                {
                    return true;
                }

                i++;
            }
            else if (input[i] == '\r' && i + 2 < input.Length && input[i + 1] == '\n')
            {
                // Windows-style newline (\r\n), check the character after
                var nextChar = input[i + 2];
                if (nextChar == ' ' || nextChar == '\t')
                {
                    return true;
                }

                // Skip both \r and \n
                i += 2;
            }
            else
            {
                i++;
            }
        }

        return false;
    }

    private static bool TryFormatJson(string input, out string formattedJson)
    {
        formattedJson = input;
        try
        {
            var trimmed = input.TrimStart();
            if (!trimmed.StartsWith('{') && !trimmed.StartsWith('['))
            {
                return false;
            }

            if (IsAlreadyFormatted(input))
            {
                using var validationDoc = JsonDocument.Parse(input);
                return true;
            }

            using var doc = JsonDocument.Parse(input);
            formattedJson = JsonSerializer.Serialize(doc.RootElement, _jsonOptions);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static bool TryFormatXml(string input, out string formattedXml)
    {
        formattedXml = input;
        try
        {
            var trimmed = input.TrimStart();
            if (!trimmed.StartsWith('<'))
            {
                return false;
            }

            if (IsAlreadyFormatted(input))
            {
                _ = XDocument.Parse(input);
                return true;
            }

            var doc = XDocument.Parse(input);
            formattedXml = doc.Declaration != null
                ? doc.Declaration.ToString() + Environment.NewLine + doc.ToString()
                : doc.ToString();
            return true;
        }
        catch (System.Xml.XmlException)
        {
            return false;
        }
        catch (Exception)
        {
            return false;
        }
    }
}
