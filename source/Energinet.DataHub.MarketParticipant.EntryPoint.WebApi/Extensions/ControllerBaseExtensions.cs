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
using System.IO;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Extensions
{
    public static class ControllerBaseExtensions
    {
        public static async Task<IActionResult> ProcessAsync(
            this ControllerBase controller,
            Func<Task<IActionResult>> worker,
            ILogger logger,
            [CallerFilePath] string? callerFilePath = null)
        {
            ArgumentNullException.ThrowIfNull(controller, nameof(controller));
            ArgumentNullException.ThrowIfNull(worker, nameof(worker));

            var callerClass = Path.GetFileNameWithoutExtension(callerFilePath)!;

            try
            {
                logger.LogInformation($"Processing {callerClass}...");
                return await worker().ConfigureAwait(false);
            }
#pragma warning disable CA1031
            catch (Exception ex)
#pragma warning restore CA1031
            {
                ex.Log(logger);
                return ex.AsIActionResult();
            }
        }
    }
}
