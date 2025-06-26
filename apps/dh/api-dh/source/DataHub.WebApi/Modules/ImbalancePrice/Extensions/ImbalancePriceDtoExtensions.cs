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

public static class ImbalancePriceDtoExtensions
{
    public static ICollection<ImbalancePriceDto> EnsureFullDataset(this ICollection<ImbalancePriceDto> imbalancePrices)
    {
        var count = imbalancePrices
                        // Handle if the same hour is present multiple times (e.g. due to daylight saving time)
                        .DistinctBy(x => x.Timestamp.Hour)
                        .Count();

        // Fill in so that we have 24 hours of data
        if (count < 24)
        {
            var lastTimestamp = imbalancePrices.Last().Timestamp;

            for (int i = 1; i <= 24 - count; i++)
            {
                var missingTimestamp = lastTimestamp.AddHours(i);
                var missingPrice = new ImbalancePriceDto
                {
                    Timestamp = missingTimestamp,
                    Price = null,
                };

                imbalancePrices.Add(missingPrice);
            }
        }

        return imbalancePrices;
    }
}
