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
using Energinet.DataHub.Reports.Abstractions.Model;
using Energinet.DataHub.Reports.Abstractions.Model.Shared;
using Energinet.DataHub.WebApi.Modules.Reports.Types;

namespace Energinet.DataHub.WebApi.Modules.Reports.Models;

public class ReportDto
{
    public string Id { get; set; } = default!;

    public DateTimeOffset CreatedDateTime { get; set; } = default!;

    public RequestedReportType ReportType { get; set; } = default!;

    public IReadOnlyCollection<MeteringPointType>? MeteringPointTypes { get; set; } = default!;

    public IReadOnlyCollection<string>? GridAreaCodes { get; set; } = default!;

    public ReportStatus Status { get; set; } = default!;
}
