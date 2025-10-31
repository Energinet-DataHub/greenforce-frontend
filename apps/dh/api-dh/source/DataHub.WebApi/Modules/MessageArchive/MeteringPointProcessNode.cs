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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Enums;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.Processes.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive;

[ObjectType<MeteringPointProcess>]
public static partial class MeteringPointProcessNode
{
    [Query]
    [UsePaging]
    [UseSorting]
    public static async Task<IEnumerable<MeteringPointProcess>> GetMeteringPointProcessOverviewAsync(
        string meteringPointId,
        Interval created) =>
        await Task.FromResult<IEnumerable<MeteringPointProcess>>([
            new MeteringPointProcess(
                Id: "01992fc0-702d-7482-b524-523ab2ad545c",
                CreatedAt: new DateTimeOffset(2023, 1, 1, 0, 0, 0, 0, TimeSpan.Zero),
                CutoffDate: new DateTimeOffset(2023, 2, 1, 0, 0, 0, 0, TimeSpan.Zero),
                DocumentType: DocumentType.RequestWholesaleSettlement,
                ReasonCode: "E20",
                ActorNumber: "905495045940594",
                ActorRole: "GridAccessProvider",
                State: ProcessState.Succeeded),
        ]);

    [Query]
    public static async Task<MeteringPointProcess?> GetMeteringPointProcessByIdAsync(string id) =>
        await Task.FromResult<MeteringPointProcess>(
            new MeteringPointProcess(
                Id: "01992fc0-702d-7482-b524-523ab2ad545c",
                CreatedAt: new DateTimeOffset(2023, 1, 1, 0, 0, 0, 0, TimeSpan.Zero),
                CutoffDate: new DateTimeOffset(2023, 2, 1, 0, 0, 0, 0, TimeSpan.Zero),
                DocumentType: DocumentType.RequestWholesaleSettlement,
                ReasonCode: "E20",
                ActorNumber: "905495045940594",
                ActorRole: "GridAccessProvider",
                State: ProcessState.Succeeded));

    public static async Task<ActorDto?> GetInitiatorAsync(
        [Parent] MeteringPointProcess process,
        IMarketParticipantByNumberAndRoleDataLoader dataLoader) =>
        Enum.TryParse<EicFunction>(process.ActorRole, out var role)
            ? await dataLoader.LoadAsync((process.ActorNumber, role))
            : null;

    public static IEnumerable<MeteringPointProcessStep> GetSteps(
        [Parent] MeteringPointProcess process) =>
        [
            new MeteringPointProcessStep(
                Id: "0199f10f-d7e4-7ad3-b250-f1e88cd2a510",
                Step: "REQUEST_END_OF_SUPPLY",
                Comment: null,
                CreatedAt: new DateTimeOffset(2023, 1, 1, 0, 0, 0, 0, TimeSpan.Zero),
                DueDate: new DateTimeOffset(2023, 2, 1, 0, 0, 0, 0, TimeSpan.Zero),
                ActorNumber: "905495045940594",
                ActorRole: "GridAccessProvider",
                State: ProcessState.Pending,
                MessageId: "a7d4c835d67c4d0d88345e27d33c538b"), // MessageId which exists on test001
        ];

    static partial void Configure(IObjectTypeDescriptor<MeteringPointProcess> descriptor)
    {
        descriptor.Name("MeteringPointProcess");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.DocumentType);
        descriptor.Field(f => f.ReasonCode);
        descriptor.Field(f => f.CreatedAt);
        descriptor.Field(f => f.CutoffDate);
        descriptor.Field(f => f.State);
    }
}
