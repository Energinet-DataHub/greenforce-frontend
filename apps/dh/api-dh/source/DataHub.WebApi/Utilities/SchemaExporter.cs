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

namespace Energinet.DataHub.WebApi.Utilities;

/// <summary>
/// Utility for exporting GraphQL schema SDL in a platform-consistent format.
///
/// Sorting and canonical ordering is handled downstream by the JavaScript
/// <c>tools/normalize-schema.js</c> step (which uses <c>lexicographicSortSchema</c>
/// from the <c>graphql</c> package) so that there is a single source of truth for
/// the committed schema shape. This class is responsible only for ensuring the
/// SDL written to disk uses LF line endings regardless of the host OS.
/// </summary>
public static class SchemaExporter
{
    /// <summary>
    /// Normalizes line endings in the given SDL to LF so the file is
    /// byte-identical across Windows and Unix build agents.
    /// </summary>
    public static string NormalizeSdl(string sdl) =>
        sdl.Replace("\r\n", "\n");
}
