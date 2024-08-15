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
using Energinet.DataHub.WebApi.GraphQL.Resolvers;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Balance;

public class BalanceResponsiblePageResultType : ObjectType<BalanceResponsiblePageResult>
{
    protected override void Configure(
        IObjectTypeDescriptor<BalanceResponsiblePageResult> descriptor)
    {
        descriptor.Name("BalanceResponsiblePageResult");

        descriptor
            .Field("balanceResponsiblesUrl")
            .Argument("locale", a => a.Type<NonNullType<StringType>>())
            .Resolve(
                context =>
            {
                var locale = context.ArgumentValue<string>("locale");
                var httpContext = context.Service<IHttpContextAccessor>().HttpContext;
                var linkGenerator = context.Service<LinkGenerator>();
                var sortDirection = context.Variables.GetVariable<SortDirection>("sortDirection");
                var sortProperty = context.Variables.GetVariable<BalanceResponsibleSortProperty>("sortProperty");
                return linkGenerator.GetUriByAction(
                    httpContext!,
                    "DownloadBalanceResponsibles",
                    "EsettExchange",
                    new { locale, sortProperty, sortDirection });
            });
    }
}
