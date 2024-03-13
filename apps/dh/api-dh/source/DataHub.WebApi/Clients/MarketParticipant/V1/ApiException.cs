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
using System.Collections.Generic;
using System.Text.Json;

#pragma warning disable SA1300 // Element should begin with upper-case letter
namespace Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
#pragma warning restore SA1300 // Element should begin with upper-case letter

public partial class ApiException
{
    private static readonly JsonSerializerOptions _jsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private IReadOnlyCollection<ApiErrorDescriptor>? _apiErrors;

    public IReadOnlyCollection<ApiErrorDescriptor> ApiErrors => ReadErrorResponse();

    private IReadOnlyCollection<ApiErrorDescriptor> ReadErrorResponse()
    {
        if (_apiErrors != null)
        {
            return _apiErrors;
        }

        if (Response == null || StatusCode is not 400 and not 404)
        {
            return Array.Empty<ApiErrorDescriptor>();
        }

        var errorResponse = JsonSerializer.Deserialize<ApiErrorResponse>(Response, _jsonSerializerOptions);
        if (errorResponse == null)
        {
            return Array.Empty<ApiErrorDescriptor>();
        }

        return _apiErrors = errorResponse.Errors;
    }
}
