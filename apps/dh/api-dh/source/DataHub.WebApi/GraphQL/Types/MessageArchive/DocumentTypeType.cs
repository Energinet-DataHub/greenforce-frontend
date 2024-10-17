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
// limitations under the License

using Energinet.DataHub.Edi.B2CWebApp.Clients.v3;

public class DocumentTypeType : EnumType<DocumentType>
{
    protected override void Configure(IEnumTypeDescriptor<DocumentType> descriptor)
    {
        descriptor
            .Value(DocumentType.B2CRequestAggregatedMeasureData)
            .Name("B2C_REQUEST_AGGREGATED_MEASURE_DATA");

        descriptor
            .Value(DocumentType.B2CRequestWholesaleSettlement)
            .Name("B2C_REQUEST_WHOLESALE_SETTLEMENT");
    }
}
