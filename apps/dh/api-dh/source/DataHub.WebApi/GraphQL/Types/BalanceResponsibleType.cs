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

using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using HotChocolate.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class BalanceResponsibleType : ObjectType<BalanceResponsibleResult>
    {
        protected override void Configure(
            IObjectTypeDescriptor<BalanceResponsibleResult> descriptor)
        {
            descriptor.Name("BalanceResponsibleType");

            descriptor.Field(f => f.ValidFromDate)
               .Name("validPeriod").
               Resolve((context, token) =>
               {
                   var balanceResponsible = context.Parent<BalanceResponsibleResult>();
                   return new Interval(Instant.FromDateTimeOffset(balanceResponsible.ValidFromDate), balanceResponsible.ValidToDate.HasValue ? Instant.FromDateTimeOffset(balanceResponsible.ValidToDate.Value) : Instant.MaxValue);
               });

            descriptor.Field(f => f.ValidToDate).Ignore();

            descriptor
               .Field("gridAreaWithName")
               .ResolveWith<EsettExchangeResolvers>(c => c.GetGridAreaAsync(default(BalanceResponsibleResult)!, default!));

            descriptor
               .Field("supplierWithName")
               .ResolveWith<EsettExchangeResolvers>(c => c.GetSupplierWithNameAsync(default!, default!));

            descriptor
               .Field("balanceResponsibleWithName")
               .ResolveWith<EsettExchangeResolvers>(c => c.GetBalanceResponsibleWithNameAsync(default!, default!));
        }
    }
}
