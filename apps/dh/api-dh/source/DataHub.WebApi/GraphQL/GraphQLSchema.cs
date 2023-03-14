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

using System;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.Wholesale.v2_1;
using GraphQL;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;
using BatchState = Energinet.DataHub.WebApi.Clients.Wholesale.v2.BatchState;
using TimeSeriesType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.TimeSeriesType;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class GraphQLSchema : Schema
    {
        public GraphQLSchema(IServiceProvider provider)
            : base(provider)
        {
            this.RegisterTypeMapping<PermissionDetailsDto, PermissionDtoType>();
            this.RegisterTypeMapping<AddressDto, AddressDtoType>();
            this.RegisterTypeMapping<OrganizationDto, OrganizationDtoType>();
            this.RegisterTypeMapping<Actor, ActorDtoType>();
            this.RegisterTypeMapping<ActorNumberDto, ActorNumberDtoType>();
            this.RegisterTypeMapping<ActorNameDto, ActorNameDtoType>();
            this.RegisterTypeMapping<ActorMarketRoleDto, ActorMarketRoleDtoType>();
            this.RegisterTypeMapping<ActorGridAreaDto, ActorGridAreaDtoType>();
            this.RegisterTypeMapping<BatchDtoV2, BatchType>();
            this.RegisterTypeMapping<ProcessStepResultDto, ProcessStepType>();
            this.RegisterTypeMapping<TimeSeriesPointDto, TimeSeriesPointType>();
            this.RegisterTypeMapping<ProcessType, ProcessTypeEnum>();
            this.RegisterTypeMapping<GridAreaDto, GridAreaType>();
            this.RegisterTypeMapping<PermissionAuditLogDto, PermissionAuditLogDtoType>();
            this.RegisterTypeMapping<PermissionChangeType, PermissionChangeTypeEnum>();

            Query = provider.GetRequiredService<GraphQLQuery>();
        }
    }
}
