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
namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

public class MeteringPointDto
{
    public long Id { get; set; }

    public string Identification { get; set; } = default!;

    public MeteringPointMetadataDto Metadata { get; set; } = default!;

    public ICollection<MeteringPointMetadataDto> MetadataTimeline { get; set; } = default!;

    public CommercialRelationDto? CommercialRelation { get; set; }

    public ICollection<CommercialRelationDto> CommercialRelationTimeline { get; set; } = default!;
}
