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

using Energinet.DataHub.WebApi.Modules.Common.Utilities;
using NodaTime;
using NodaTime.Text;

namespace Energinet.DataHub.WebApi.Modules.Common.Models;

public record Resolution(string Name, string Duration) : Enumeration<Resolution>
{
    public static readonly Resolution QuarterHourly = new Resolution(nameof(QuarterHourly), "PT15M");
    public static readonly Resolution Hourly = new Resolution(nameof(Hourly), "PT1H");
    public static readonly Resolution Daily = new Resolution(nameof(Daily), "P1D");
    public static readonly Resolution Monthly = new Resolution(nameof(Monthly), "P1M");

    public Period ToPeriod() => PeriodPattern.NormalizingIso.Parse(Duration).Value;

    public static Resolution FromName(string name) =>
        name.ToLower() switch
        {
            "quarterhourly" => QuarterHourly,
            "hourly" => Hourly,
            "daily" => Daily,
            "monthly" => Monthly,
            _ => throw new ArgumentException(),
        };

    public static Resolution FromDuration(string duration) =>
        duration switch
        {
            "PT15M" => QuarterHourly,
            "PT1H" => Hourly,
            "P1D" => Daily,
            "P1M" => Monthly,
            _ => throw new ArgumentException(),
        };

    public T CastFromDuration<T>()
        where T : Enum => (T)Enum.Parse(typeof(T), Duration, true);
}
