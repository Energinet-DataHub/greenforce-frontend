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

using System.Runtime.CompilerServices;
using Energinet.DataHub.WebApi.Modules.Common.Utilities;
using NodaTime;
using NodaTime.Text;

namespace Energinet.DataHub.WebApi.Modules.Common.Models;

public record Resolution : Enumeration<Resolution>
{
    public required string Duration { get; init; }

    public static readonly Resolution QuarterHourly = new() { Duration = "PT15M" };
    public static readonly Resolution Hourly = new() { Duration = "PT1H" };
    public static readonly Resolution Daily = new() { Duration = "P1D" };
    public static readonly Resolution Monthly = new() { Duration = "P1M" };

    public static Resolution FromDuration(string duration)
        => GetAll().First(r => r.Duration == duration);

    public T CastDurationTo<T>()
        where T : Enum => (T)Enum.Parse(typeof(T), Duration, true);

    private Resolution([CallerMemberName] string name = "")
        : base(name) { }
}
