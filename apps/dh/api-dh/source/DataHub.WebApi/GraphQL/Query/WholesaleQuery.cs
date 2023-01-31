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
using Energinet.DataHub.Wholesale.Client;
using Energinet.DataHub.Wholesale.Contracts;
using GraphQL;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class WholesaleQuery : ObjectGraphType
    {
        public WholesaleQuery()
        {
            Field<BatchType>("batch")
                .Argument<IdGraphType>("id", "The id of the organization")
                .ResolveAsync(async context =>
                {
                    var client = context.RequestServices!.GetRequiredService<IWholesaleClient>();
                    var id = context.GetArgument<Guid>("id");
                    return await client.GetBatchAsync(id).ConfigureAwait(false);

                    // var batch = new BatchDtoV2(
                    //     new Guid("0feb0e39-4dd4-45c9-bd93-4228b09cec7f"),
                    //     new DateTimeOffset(new DateTime(2023, 01, 01, 0, 0, 0, 0, DateTimeKind.Utc).AddHours(-1)),
                    //     new DateTimeOffset(new DateTime(2023, 01, 03, 0, 0, 0, 0, DateTimeKind.Utc).AddHours(-1)),
                    //     new DateTimeOffset(DateTime.UtcNow),
                    //     new DateTimeOffset(DateTime.UtcNow),
                    //     BatchState.Completed,
                    //     true,
                    //     new string[] { "123", "456" });

                    // return batch;
                });
        }
    }
}
