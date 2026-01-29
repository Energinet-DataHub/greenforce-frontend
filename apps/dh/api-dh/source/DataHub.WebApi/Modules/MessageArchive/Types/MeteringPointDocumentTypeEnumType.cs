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

using Energinet.DataHub.EDI.B2CClient.Abstractions.MeteringPointArchivedMessages.V1;
using Energinet.DataHub.WebApi.Modules.Common.Models;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Types;

public class MeteringPointDocumentTypeEnumType : EnumType<MeteringPointDocumentTypeDtoV1>
{
    protected override void Configure(IEnumTypeDescriptor<MeteringPointDocumentTypeDtoV1> descriptor)
    {
        descriptor.Name("MeteringPointDocumentType");

        descriptor
            .Value(MeteringPointDocumentTypeDtoV1.B2CUpdateChargeLinks)
            .Name(DocumentType.B2CUpdateChargeLinks.GraphQLName);
    }
}
