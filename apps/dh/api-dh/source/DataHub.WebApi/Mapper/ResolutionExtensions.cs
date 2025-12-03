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

using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestWholesaleSettlement.V1;
using Energinet.DataHub.WebApi.Model;

namespace Energinet.DataHub.WebApi.Mapper;

public static class ResolutionExtensions
{
    public static ResolutionV1 MapToRequestWholesaleSettlementV1(this Resolution source)
    {
        return source switch
        {
            Resolution.Hourly => ResolutionV1.Hourly,
            Resolution.Monthly => ResolutionV1.Monthly,
            Resolution.QuarterHourly => ResolutionV1.QuarterHourly,
        };
    }

    public static ResolutionV1? MapToRequestWholesaleSettlementV1(this Resolution? source)
    {
        return source?.MapToRequestWholesaleSettlementV1();
    }
}
