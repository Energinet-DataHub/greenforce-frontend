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

using Energinet.DataHub.Charges.Abstractions.Api.V1.HistoricalChargeInformationPeriods;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.WebApi.Common;
using HotChocolate.Execution.Configuration;

namespace Energinet.DataHub.WebApi.Modules.Charges.Models;

[InterfaceType]
public abstract record ChargeChange(DateTimeOffset CreatedAt)
{
    public sealed record ChargeCancelled(
        DateTimeOffset CreatedAt,
        DateTimeOffset EffectiveDate) : ChargeChange(CreatedAt);

    public sealed record ChargeDescriptionChanged(
        DateTimeOffset CreatedAt,
        DateTimeOffset EffectiveDate,
        string Previous,
        string Current) : ChargeChange(CreatedAt);

    public sealed record ChargeNameChanged(
        DateTimeOffset CreatedAt,
        DateTimeOffset EffectiveDate,
        string Previous,
        string Current) : ChargeChange(CreatedAt);

    public sealed record ChargeResumed(
        DateTimeOffset CreatedAt,
        DateTimeOffset EffectiveDate) : ChargeChange(CreatedAt);

    public sealed record ChargeStarted(
        DateTimeOffset CreatedAt) : ChargeChange(CreatedAt);

    public sealed record ChargeStopped(
        DateTimeOffset CreatedAt,
        DateTimeOffset EffectiveDate) : ChargeChange(CreatedAt);

    public sealed record ChargeTransparentInvoicingChanged(
        DateTimeOffset CreatedAt,
        DateTimeOffset EffectiveDate,
        bool Previous,
        bool Current) : ChargeChange(CreatedAt);

    public sealed record ChargeVatChanged(
        DateTimeOffset CreatedAt,
        DateTimeOffset EffectiveDate,
        bool Previous,
        bool Current) : ChargeChange(CreatedAt);

    public static IEnumerable<ChargeChange> From(IEnumerable<HistoricalChargeInformationPeriodDto> periods)
    {
        // Updating a charge with a new cut off date results in two changes with the same
        // orchestration ID; first change stops the current period and the next creates a new
        // period with the changes. The history view is only interested in the updated values,
        // so the simple solution here is to take the last change for each orchestration ID.
        var snapshots = periods
            .GroupBy(p => p.OrchestrationInstanceId)
            .Select(g => g.OrderBy(p => p.StartDate).Last())
            .Select(ToSnapshot)
            .OrderBy(p => p.Created)
            .ToList();

        return snapshots
            .Skip(1)
            .SelectMany((current, i) => Compare(snapshots[i], current))
            .Prepend(new ChargeStarted(snapshots.First().Created));
    }

    [ConfigureGraphQL]
    internal static IRequestExecutorBuilder ConfigureGraphQL(IRequestExecutorBuilder builder)
        => builder
            .AddType<ChargeCancelled>()
            .AddType<ChargeDescriptionChanged>()
            .AddType<ChargeNameChanged>()
            .AddType<ChargeResumed>()
            .AddType<ChargeStarted>()
            .AddType<ChargeStopped>()
            .AddType<ChargeTransparentInvoicingChanged>()
            .AddType<ChargeVatChanged>();

    // Compares two snapshots and return the changes between them. Comparison is done recursively
    // by peeling off changes one at a time and continuing to look for changes in the remaining.
    private static IEnumerable<ChargeChange> Compare(Snapshot p, Snapshot c) => (Previous: p, Current: c) switch
    {
        // Charge resumed. This happens when a price is created anew, so it may also
        // contain updated values. Continue to look for changes
        { Previous.EndDate: not null, Current.EndDate: null } => [
            new ChargeResumed(c.Created, c.StartDate),
            .. Compare(p with { EndDate = null }, c)],

        // Name changed. Continue to look for changes.
        var change when change.Previous.Name != change.Current.Name => [
            new ChargeNameChanged(c.Created, c.StartDate, p.Name, c.Name),
            .. Compare(p with { Name = c.Name }, c)],

        // Description changed. Continue to look for changes.
        var change when change.Previous.Description != change.Current.Description => [
            new ChargeDescriptionChanged(c.Created, c.StartDate, p.Description, c.Description),
            .. Compare(p with { Description = c.Description }, c)],

        // Vat changed. Continue to look for changes.
        var change when change.Previous.VatInclusive != change.Current.VatInclusive => [
            new ChargeVatChanged(c.Created, c.StartDate, p.VatInclusive, c.VatInclusive),
            .. Compare(p with { VatInclusive = c.VatInclusive }, c)],

        // Transparent invoicing changed. Continue to look for changes.
        var change when change.Previous.TransparentInvoicing != change.Current.TransparentInvoicing => [
            new ChargeTransparentInvoicingChanged(
                c.Created,
                c.StartDate,
                p.TransparentInvoicing,
                c.TransparentInvoicing),
            .. Compare(p with { TransparentInvoicing = c.TransparentInvoicing }, c)],

        // Charge cancelled. Only has to look at the current value, since cancelled
        // periods cannot be changed further. Ends recursion.
        var change when change.Current.StartDate == change.Current.EndDate =>
            [new ChargeCancelled(c.Created, c.StartDate)],

        // Charge stopped. There should not be other changes along with a stop, but in
        // case there is they should have been handled at this point. Ends recursion.
        { Current.EndDate: { } currentEnd } when p.EndDate != currentEnd
            => [new ChargeStopped(c.Created, currentEnd)],

        // No more changes
        _ => [],
    };

    private record Snapshot(
        string Name,
        string Description,
        bool VatInclusive,
        bool TransparentInvoicing,
        DateTimeOffset StartDate,
        DateTimeOffset? EndDate,
        DateTimeOffset Created);

    private static Snapshot ToSnapshot(HistoricalChargeInformationPeriodDto dto) => new(
        Name: dto.Name,
        Description: dto.Description,
        VatInclusive: dto.VatClassificationDto == VatClassificationDto.Vat25,
        TransparentInvoicing: dto.TransparentInvoicing,
        StartDate: dto.StartDate.ToDateTimeOffset(),
        EndDate: dto.EndDate?.ToDateTimeOffset(),
        Created: dto.Created.ToDateTimeOffset());
}
