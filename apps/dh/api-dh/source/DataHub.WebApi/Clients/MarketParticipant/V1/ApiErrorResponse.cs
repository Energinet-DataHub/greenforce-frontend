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

using System.Collections.Generic;

#pragma warning disable SA1300 // Element should begin with upper-case letter
namespace Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
#pragma warning restore SA1300 // Element should begin with upper-case letter

public sealed record ApiErrorResponse(IReadOnlyCollection<ApiErrorDescriptor> Errors);
