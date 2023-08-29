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
using System.Reactive.Linq;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public sealed class GraphQLSubscription : ObjectGraphType
    {
        public GraphQLSubscription()
        {
            // perhaps list type?
            Field<BatchDto>("onCalculationCreated")
              .ResolveStream(context =>
              {
                var client = context.RequestServices!.GetRequiredService<IWholesaleClient_V3>();
                return Observable.Interval(TimeSpan.FromSeconds(10))
                  .Select(_ => DateTimeOffset.UtcNow.AddSeconds(-10))
                  .SelectMany(minExecutionTime => client.SearchBatchesAsync(null, null, minExecutionTime))
                  .SelectMany(x => x.ToObservable())
                  .Distinct(calculation => calculation.BatchId);
              });

            // Field<BatchDto>("onCalculationUpdated")
            //   .ResolveStream(context =>
            //   {
            //     var client = context.RequestServices!.GetRequiredService<IWholesaleClient_V3>();
            //     return Observable.Interval(TimeSpan.FromSeconds(10))
            //       .Select(_ => DateTimeOffset.UtcNow.AddSeconds(-10))
            //       .SelectMany(minExecutionTime => client.SearchBatchesAsync(null, null, minExecutionTime))
            //       .SelectMany(x => x.ToObservable())
            //       .Distinct(calculation => calculation.BatchId);
            //   });
        }
    }
}

// [pending, completed, running, failed]
// [running, completed, running, failed]
// [running, completed, failed, failed]
