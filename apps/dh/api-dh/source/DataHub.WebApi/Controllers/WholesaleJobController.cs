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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NodaTime;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleJobController : ControllerBase
    {
        private int _nextJobId = 51234;
        private List<WholesaleJob> _jobs = new();
        private IClock _clock;

        public WholesaleJobController()
        {
            _clock = SystemClock.Instance;
        }

        /// <summary>
        /// Request a process job.
        /// </summary>
        [HttpPost("CreateJob")]
        public async Task<ActionResult> CreateProcessAsync(WholesaleProcess process, [FromQuery]List<int> gridAreas)
        {
            await Task.CompletedTask;
            _jobs.Add(new WholesaleJob
            {
                Id = _nextJobId++,
                Status = WholesaleJobStatus.Requested,
                ProcessNumberOfGridAreas = gridAreas.Count,
                ProcessName = process,
                RequestDateTime = _clock.GetCurrentInstant(),
            });
            return Accepted();
        }

        /// <summary>
        /// Get most recent jobs.
        /// </summary>
        /// <param name="maxCount">Maximum number of jobs to return.</param>
        /// <returns>A list of the most recent jobs by request time.</returns>
        /// <response code="200">Returns a list of jobs.</response>
        [HttpGet("GetJobs")]
        public ActionResult<List<WholesaleJob>> GetJobs(int maxCount = 10)
        {
            return Ok(_jobs.OrderByDescending(j => j.RequestDateTime).Take(maxCount));
        }

        public enum WholesaleProcess
        {
            BalanceFixing,
        }

        public class WholesaleJob
        {
            public int Id { get; set; }

            public WholesaleProcess ProcessName { get; set; }

            public int ProcessNumberOfGridAreas { get; set; }

            public WholesaleJobStatus Status { get; set; }

            public Instant RequestDateTime { get; set; }
        }

        public enum WholesaleJobStatus
        {
            Requested,
        }
    }
}
