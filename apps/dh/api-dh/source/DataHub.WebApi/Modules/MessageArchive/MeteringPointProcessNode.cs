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

using Energinet.DataHub.WebApi.Modules.MessageArchive.Enums;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Esett;

[ObjectType<MeteringPointProcess>]
public static partial class MeteringPointProcessNode
{
    [Query]
    [UsePaging]
    [UseSorting]
    public static async Task<IEnumerable<MeteringPointProcess>> GetProcessesForMeteringPointAsync(
        string meteringPointId,
        Interval created) =>
        await Task.FromResult<IEnumerable<MeteringPointProcess>>([
            new MeteringPointProcess(
                Id: "01992fc0-702d-7482-b524-523ab2ad545c",
                CreatedAt: new DateTimeOffset(2023, 1, 1, 0, 0, 0, 0, TimeSpan.Zero),
                DocumentType: DocumentType.RequestWholesaleSettlement,
                ActorNumber: null,
                ActorRole: null),
        ]);

    static partial void Configure(IObjectTypeDescriptor<MeteringPointProcess> descriptor)
    {
        descriptor.Name("MeteringPointProcess");
        descriptor.BindFieldsExplicitly();
        descriptor.Field(f => f.Id);
        descriptor.Field(f => f.DocumentType);
        descriptor.Field(f => f.CreatedAt);
    }
}
