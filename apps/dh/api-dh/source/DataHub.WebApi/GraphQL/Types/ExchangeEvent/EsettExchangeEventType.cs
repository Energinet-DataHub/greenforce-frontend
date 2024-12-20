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

namespace Energinet.DataHub.WebApi.GraphQL.Types.ExchangeEvent;

public class EsettExchangeEventType : ObjectType<ExchangeEventTrackingResult>
{
    protected override void Configure(
        IObjectTypeDescriptor<ExchangeEventTrackingResult> descriptor)
    {
        descriptor.Name("EsettOutgoingMessage");

        descriptor.Field(f => f.PeriodFrom)
            .Name("period").
            Resolve((context, _) =>
            {
                var trackingResult = context.Parent<ExchangeEventTrackingResult>();
                return new Interval(Instant.FromDateTimeOffset(trackingResult.PeriodFrom), Instant.FromDateTimeOffset(trackingResult.PeriodTo));
            });

        descriptor.Field(f => f.PeriodTo).Ignore();

        descriptor.Field("dispatchDocumentUrl")
            .ResolveWith<EsettExchangeResolvers>(c => c.GetDispatchDocument(default!, default!, default!));

        descriptor.Field("responseDocumentUrl")
            .Type<NonNullType<StringType>>()
            .ResolveWith<EsettExchangeResolvers>(c => c.GetResponseDocument(default!, default!, default!));

        descriptor
           .Field(f => f.GridAreaCode)
           .Name("gridArea")
           .ResolveWith<EsettExchangeResolvers>(c => c.GetGridAreaAsync(default(ExchangeEventTrackingResult)!, default!));
    }
}
