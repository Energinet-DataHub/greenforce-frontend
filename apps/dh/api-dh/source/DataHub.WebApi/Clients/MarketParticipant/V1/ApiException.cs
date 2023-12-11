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

namespace Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

public partial class ApiException
{
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

        var errorResponse = JsonSerializer.Deserialize<ApiErrorResponse>(Response);
        if (errorResponse == null)
        {
            return Array.Empty<ApiErrorDescriptor>();
        }

        return _apiErrors = errorResponse.Errors;
    }
}
