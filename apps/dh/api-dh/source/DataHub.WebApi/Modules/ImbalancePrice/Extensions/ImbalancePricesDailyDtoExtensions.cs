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

using Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1;

namespace Energinet.DataHub.WebApi.Modules.ImbalancePrice.Extensions;

public static class ImbalancePricesDailyDtoExtensions
{
    // Look for gaps in the data and fill them in with prices of null
    public static List<ImbalancePriceDto> FindMissingTimestamps(this ImbalancePricesDailyDto imbalancePrice)
    {
        var missingTimestamps = new List<ImbalancePriceDto>();
        var sortedPrices = imbalancePrice.ImbalancePrices.OrderBy(x => x.Timestamp);

        var previousTimestamp = sortedPrices.First().Timestamp;

        foreach (var price in sortedPrices.Skip(1))
        {
            var currentTimestamp = price.Timestamp;

            var differenceInHours = (currentTimestamp - previousTimestamp).TotalHours;

            if (differenceInHours > 1)
            {
                for (int i = 1; i < differenceInHours; i++)
                {
                    var missingTimestamp = previousTimestamp.AddHours(i);
                    var missingPrice = new ImbalancePriceDto
                    {
                        Timestamp = missingTimestamp,
                        Price = null,
                    };

                    missingTimestamps.Add(missingPrice);
                }
            }

            previousTimestamp = currentTimestamp;
        }

        return missingTimestamps;
    }
}
