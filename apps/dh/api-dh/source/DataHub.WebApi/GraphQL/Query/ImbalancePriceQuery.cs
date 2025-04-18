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
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Types.ImbalancePrice;
using LocalPriceAreaCode = Energinet.DataHub.WebApi.Modules.Common.Enums.PriceAreaCode;
using PriceAreaCode = Energinet.DataHub.WebApi.Clients.ImbalancePrices.v1.PriceAreaCode;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    public async Task<ImbalancePricesOverview> GetImbalancePricesOverviewAsync([Service] IImbalancePricesClient_V1 client)
    {
        var tz = TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time");

        var f = new DateTime(2021, 1, 1, 0, 0, 0);
        var t = new DateTime(2021, 2, 1, 0, 0, 0);
        var s = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0);

        var from = TimeZoneInfo.ConvertTime(new DateTimeOffset(f, tz.GetUtcOffset(f)), tz);
        var to = TimeZoneInfo.ConvertTime(new DateTimeOffset(t, tz.GetUtcOffset(t)), tz);
        var stop = TimeZoneInfo.ConvertTime(new DateTimeOffset(s, tz.GetUtcOffset(s)), tz);

        var tasks = new List<Task<ImbalancePricePeriod>>();

        while (from < stop)
        {
            tasks.Add(GetPricesAsync(from, to, PriceAreaCode.AreaCode1, client));
            tasks.Add(GetPricesAsync(from, to, PriceAreaCode.AreaCode2, client));
            f = f.AddMonths(1);
            t = t.AddMonths(1);
            from = TimeZoneInfo.ConvertTime(new DateTimeOffset(f, tz.GetUtcOffset(f)), tz);
            to = TimeZoneInfo.ConvertTime(new DateTimeOffset(t, tz.GetUtcOffset(t)), tz);
        }

        var imbalancePricePeriods = await Task.WhenAll(tasks);

        return new ImbalancePricesOverview
        {
            PricePeriods = imbalancePricePeriods.OrderByDescending(x => x.Name).ThenBy(x => x.PriceAreaCode),
        };

        static async Task<ImbalancePricePeriod> GetPricesAsync(DateTimeOffset from, DateTimeOffset to, PriceAreaCode priceAreaCode, IImbalancePricesClient_V1 client)
        {
            var status = await client.StatusAsync(from, to, priceAreaCode);
            return new ImbalancePricePeriod
            {
                PriceAreaCode = priceAreaCode switch
                {
                    PriceAreaCode.AreaCode1 => LocalPriceAreaCode.Dk1,
                    PriceAreaCode.AreaCode2 => LocalPriceAreaCode.Dk2,
                    _ => throw new ArgumentOutOfRangeException(nameof(priceAreaCode)),
                },
                Name = from,
                Status = status switch
                {
                    ImbalancePricePeriodStatus.NoPrices => ImbalancePriceStatus.NoData,
                    ImbalancePricePeriodStatus.Incomplete => ImbalancePriceStatus.InComplete,
                    ImbalancePricePeriodStatus.Complete => ImbalancePriceStatus.Complete,
                    _ => throw new ArgumentOutOfRangeException(nameof(status)),
                },
            };
        }
    }

    public async Task<IEnumerable<ImbalancePricesDailyDto>> GetImbalancePricesForMonthAsync(
        int year,
        int month,
        LocalPriceAreaCode areaCode,
        [Service] IImbalancePricesClient_V1 client)
    {
        var parsedAreaCode = areaCode switch
        {
            LocalPriceAreaCode.Dk1 => PriceAreaCode.AreaCode1,
            LocalPriceAreaCode.Dk2 => PriceAreaCode.AreaCode2,
            _ => throw new ArgumentOutOfRangeException(nameof(areaCode)),
        };

        var imbalancePrices = await client.GetByMonthAsync(year, month, parsedAreaCode);

        foreach (var imbalancePrice in imbalancePrices)
        {
            if (imbalancePrice.ImbalancePrices.Count == 0)
            {
                continue;
            }

            var missingTimestamps = FindMissingTimestaps(imbalancePrice);

            imbalancePrice.ImbalancePrices = imbalancePrice.ImbalancePrices
                .Concat(missingTimestamps)
                .OrderBy(x => x.Timestamp)
                .ToList();

            EnsureFullDataset(imbalancePrice.ImbalancePrices);
        }

        return imbalancePrices;
    }

    // Ensure that we have 24 hours of data
    private static void EnsureFullDataset(ICollection<ImbalancePriceDto> imbalancePrices)
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
    }

    // Look for gaps in the data and fill them in with prices of null
    private static List<ImbalancePriceDto> FindMissingTimestaps(ImbalancePricesDailyDto imbalancePrice)
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
