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
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleJobController : ControllerBase
    {
        private static int _nextJobId = 51234;
        private static List<WholesaleJobV1Dto> _jobs = new();

        /// <summary>
        /// Start jobs.
        /// A job will be started per grid area.
        /// </summary>
        [HttpPost("StartJobs")]
        public async Task<ActionResult> StartJobsAsync(WholesaleProcessType processType, [FromQuery]List<string> gridAreas)
        {
            await Task.CompletedTask;
            foreach (var gridArea in gridAreas)
            {
                _jobs.Add(new WholesaleJobV1Dto
                {
                    Id = _nextJobId++,
                    Status = WholesaleJobStatus.Requested,
                    ProcessGridArea = gridArea,
                    ProcessTypeName = processType,
                    ProcessPeriodStartDateTime = DateTimeOffset.Now.Date.AddDays(-1),
                    ProcessPeriodEndDateTime = DateTimeOffset.Now.Date,
                });
            }

            return Accepted();
        }

        /// <summary>
        /// Get most recent jobs.
        /// </summary>
        /// <param name="maxCount">Maximum number of jobs to return.</param>
        /// <returns>A list of the most recent jobs by request time.</returns>
        /// <response code="200">Returns a list of jobs.</response>
        [HttpGet("GetJobs")]
        public ActionResult<List<WholesaleJobV1Dto>> GetJobs(int maxCount = 100)
        {
            return Ok(_jobs.OrderByDescending(j => j.RequestDateTime).Take(maxCount));
        }

        public enum WholesaleProcessType
        {
            BalanceFixing,
        }

        public class WholesaleJobV1Dto
        {
            public int Id { get; set; }

            public WholesaleProcessType ProcessTypeName { get; set; }

            [MaxLength(3)]
            public string? ProcessGridArea { get; set; }

            public WholesaleJobStatus Status { get; set; }

            public DateTimeOffset RequestDateTime { get; set; }

            public DateTimeOffset ProcessPeriodStartDateTime { get; set; }

            public DateTimeOffset ProcessPeriodEndDateTime { get; set; }
        }

        public enum WholesaleJobStatus
        {
            Requested,
        }
    }
}
