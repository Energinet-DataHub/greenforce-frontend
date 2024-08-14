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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Actor;

public sealed class ActorCredentialsDtoType : ObjectType<ActorCredentialsDto>
{
    private readonly string _controllerName = "MarketParticipantActor";

    protected override void Configure(IObjectTypeDescriptor<ActorCredentialsDto> descriptor)
    {
        descriptor
            .Field("assignCertificateCredentialsUrl")
            .Argument("actorId", a => a.Type<NonNullType<UuidType>>())
            .Type<NonNullType<StringType>>()
            .Resolve(
                context =>
            {
                var httpContext = context.Service<IHttpContextAccessor>().HttpContext;
                var linkGenerator = context.Service<LinkGenerator>();
                var actorId = context.ArgumentValue<Guid>("actorId");
                return linkGenerator.GetUriByAction(
                    httpContext!,
                    "AssignCertificateCredentials",
                    _controllerName,
                    new { actorId });
            });

        descriptor
            .Field("removeActorCredentialsUrl")
            .Argument("actorId", a => a.Type<NonNullType<UuidType>>())
            .Type<NonNullType<StringType>>()
            .Resolve(
                context =>
            {
                var httpContext = context.Service<IHttpContextAccessor>().HttpContext;
                var linkGenerator = context.Service<LinkGenerator>();
                var actorId = context.ArgumentValue<Guid>("actorId");
                return linkGenerator.GetUriByAction(
                    httpContext!,
                    "RemoveActorCredentials",
                    _controllerName,
                    new { actorId });
            });
    }
}
