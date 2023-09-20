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
using System.Threading.Tasks;
using CookieCrumble;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Tests.TestServices;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL
{
    public class WholesaleQueryTests
    {
        private static readonly Guid _batchId = new("9cce3e8f-b56d-49f8-a6af-42cc6dc3246f");
        private static readonly string _calculationByIdQuery = $$"""
          {
            calculationById(id: "{{_batchId}}") {
              id
              statusType
            }
          }
        """;

        [Fact]
        public async Task GetPendingCalculation()
        {
            GraphQLTestService.WholesaleClientV3Mock
                .Setup(x => x.GetBatchAsync(_batchId, default))
                .ReturnsAsync(new BatchDto()
                {
                    BatchId = _batchId,
                    ExecutionState = BatchState.Pending,
                });

            var result = await GraphQLTestService
                .ExecuteRequestAsync(b => b.SetQuery(_calculationByIdQuery));

            result.MatchSnapshot();
        }

        [Fact]
        public async Task GetExecutingCalculation()
        {
            GraphQLTestService.WholesaleClientV3Mock
                .Setup(x => x.GetBatchAsync(_batchId, default))
                .ReturnsAsync(new BatchDto()
                {
                    BatchId = _batchId,
                    ExecutionState = BatchState.Executing,
                });

            var result = await GraphQLTestService
                .ExecuteRequestAsync(b => b.SetQuery(_calculationByIdQuery));

            result.MatchSnapshot();
        }

        [Fact]
        public async Task GetCompletedCalculation()
        {
            GraphQLTestService.WholesaleClientV3Mock
                .Setup(x => x.GetBatchAsync(_batchId, default))
                .ReturnsAsync(new BatchDto()
                {
                    BatchId = _batchId,
                    ExecutionState = BatchState.Completed,
                });

            var result = await GraphQLTestService
                .ExecuteRequestAsync(b => b.SetQuery(_calculationByIdQuery));

            result.MatchSnapshot();
        }

        [Fact]
        public async Task GetFailedCalculation()
        {
            GraphQLTestService.WholesaleClientV3Mock
                .Setup(x => x.GetBatchAsync(_batchId, default))
                .ReturnsAsync(new BatchDto()
                {
                    BatchId = _batchId,
                    ExecutionState = BatchState.Failed,
                });

            var result = await GraphQLTestService
                .ExecuteRequestAsync(b => b.SetQuery(_calculationByIdQuery));

            result.MatchSnapshot();
        }
    }
}
