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

using HotChocolate.Data.Sorting;

namespace Energinet.DataHub.WebApi.GraphQL.Types.ExchangeEvent;

public class EsettExchangeEventSortInputType : InputObjectType<EsettExchangeEventSortInput>
{
    protected override void Configure(
        IInputObjectTypeDescriptor<EsettExchangeEventSortInput> descriptor)
    {
        descriptor.Field(f => f.CalculationType).Type<DefaultSortEnumType>();
        descriptor.Field(f => f.Created).Type<DefaultSortEnumType>();
        descriptor.Field(f => f.DocumentId).Type<DefaultSortEnumType>();
        descriptor.Field(f => f.DocumentStatus).Type<DefaultSortEnumType>();
        descriptor.Field(f => f.GridAreaCode).Type<DefaultSortEnumType>();
        descriptor.Field(f => f.LatestDispatched).Type<DefaultSortEnumType>();
        descriptor.Field(f => f.TimeSeriesType).Type<DefaultSortEnumType>();
    }
}